import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plant } from './model/plant';
import { PlantService } from './service/plant.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  plants: Plant[] = [];
  loading: boolean = true;
  error: string = '';
  totalReadings: number = 0; 
  totalMediumAlerts: number = 0; 
  totalRedAlerts: number = 0; 
  totalDisabledSensors: number = 0; 

  isActionMenuOpen: number | null = null; 

    isMenuOpen: number | null = null; 

    selectedPlantIndicators: any = null; // Para almacenar los indicadores de la planta seleccionada

  // Propiedades para el formulario reactivo
  showForm: boolean = false; // Controlar la visibilidad del formulario
  plantForm: FormGroup; // Declarar el formulario
// Agregar las propiedades necesarias para la edición
showEditForm: boolean = false; // Controlar la visibilidad del formulario de edición
editingPlantForm: FormGroup; // Declarar el formulario de edición
editingPlant: Plant | null = null; // Guardar la planta que se está editando


userData: any;


constructor(private plantService: PlantService, private fb: FormBuilder, private authService:AuthService) { 
  // Inicializar el formulario de crear planta
  this.plantForm = this.fb.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      countryCode: ['', Validators.required],
      readings: [0, Validators.required],
      mediumAlerts: [0, Validators.required],
      redAlerts: [0, Validators.required],
      disabledSensors: [0, Validators.required]
  });

  // Inicializar el formulario de editar planta
  this.editingPlantForm = this.fb.group({
      name: [{ value: '', disabled: true }, Validators.required],
      country: [{ value: '', disabled: true }, Validators.required],
      countryCode: [{ value: '', disabled: true }, Validators.required],
      readings: [0, [Validators.required]],
      mediumAlerts: [0, [Validators.required]],
      redAlerts: [0, [Validators.required]],
      disabledSensors: [{ value: 0, disabled: true }, Validators.required]
  });
}

  ngOnInit(): void {
    this.fetchPlants();

    const user = localStorage.getItem('user');
    if (user) {
      this.userData = JSON.parse(user);
      console.log('Datos del usuario en el dashboard:', this.userData);
    }
  }

  

  toggleActionMenu(plantId: number) {
    // Alterna el menú de acciones
    this.isActionMenuOpen = this.isActionMenuOpen === plantId ? null : plantId;
  }

  fetchPlants(): void {
    this.plantService.getAllPlants().subscribe({
      next: (data) => {
        this.plants = data;
        this.loading = false;
        this.calculateTotals();
      },
      error: (err) => {
        this.error = 'Error al cargar las plantas';
        this.loading = false;
      }
    });
  }

  calculateTotals(): void {
    this.totalReadings = this.plants.reduce((acc, plant) => acc + plant.readings, 0);
    this.totalMediumAlerts = this.plants.reduce((acc, plant) => acc + plant.mediumAlerts, 0);
    this.totalRedAlerts = this.plants.reduce((acc, plant) => acc + plant.redAlerts, 0);
    this.totalDisabledSensors = this.plants.reduce((acc, plant) => acc + plant.disabledSensors, 0);
  }

  openForm(): void {
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.plantForm.reset(); // Resetear el formulario
  }

  createPlant(): void {
    if (this.plantForm.valid) {
      this.plantService.createPlant(this.plantForm.value).subscribe({
        next: (plant) => {
          this.plants.push(plant);
          this.calculateTotals();
          this.closeForm();
          this.fetchPlants(); // Esto actualizará la lista de plantas

        },
        error: (err) => {
          this.error = 'Error al crear la planta';
        }
      });
    }
  }

  // Método para manejar el cambio de país
  onCountryChange(event: any): void {
    const selectedCountry = this.countriesArray.find(country => country.name === event.target.value);
    if (selectedCountry) {
      this.plantForm.patchValue({ countryCode: selectedCountry.code }); // Asigna el código del país al formulario
    }
  }



  toggleMenu(plantId: number) {
    this.isMenuOpen = this.isMenuOpen === plantId ? null : plantId; // Alterna el menú
  }


  deletePlant(plant: Plant) {
    // Mostrar un alert de confirmación
    const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar la planta "${plant.name}"?`);
  
    if (confirmDelete) {
      // Llama al servicio para eliminar la planta por ID
      this.plantService.deletePlant(plant.id).subscribe({
        next: () => {
          // Si la eliminación es exitosa, filtra la planta eliminada de la lista
          this.plants = this.plants.filter(p => p.id !== plant.id);
          this.calculateTotals(); // Actualiza los totales después de eliminar
          console.log('Planta eliminada:', plant);
        },
        error: (err) => {
          // Manejo de errores
          this.error = 'Error al eliminar la planta';
          console.error('Error al eliminar la planta:', err);
        }
      });
    } else {
      // El usuario ha cancelado la eliminación
      console.log('Eliminación cancelada');
    }
  }

  
  editPlant(plant: Plant) {
    this.toggleActionMenu(plant.id); // Cierra el menú de acciones al editar
    this.editingPlant = plant; // Asigna la planta seleccionada a `editingPlant`
  
    // Inicializar el formulario para edición con los valores actuales de la planta
    this.editingPlantForm.patchValue({
      name: plant.name,
      country: plant.country,
      countryCode: plant.countryCode,
      readings: plant.readings,
      mediumAlerts: plant.mediumAlerts,
      redAlerts: plant.redAlerts,
      disabledSensors: plant.disabledSensors // Si es necesario
    });
  
    // Mostrar el formulario de edición
    this.showEditForm = true;
  }

closeEditForm(): void {
  this.showEditForm = false;
  this.editingPlantForm.reset(); // Resetear el formulario
  this.editingPlant = null; // Reiniciar la planta en edición
}

savePlant(): void {
  if (this.editingPlantForm.valid && this.editingPlant) {
    // Combina los datos actuales de la planta con los valores editados del formulario, incluidos los deshabilitados
    const updatedPlant = { 
      ...this.editingPlant, 
      ...this.editingPlantForm.getRawValue() 
    };

    this.plantService.updatePlant(updatedPlant).subscribe({
      next: () => {
        this.fetchPlants();
        this.closeEditForm();
        console.log('Planta actualizada:', updatedPlant);
      },
      error: () => {
        this.error = 'Error al actualizar la planta';
      }
    });
  }
}

printPlantData(plant: Plant): void {
  console.log('Datos de la planta:', plant);
  this.selectedPlantIndicators = plant.indicators; // Guarda los indicadores
}

getIndicators() {
  if (!this.selectedPlantIndicators) return [];

  return Object.keys(this.selectedPlantIndicators).map(key => {
      return {
          title: key.charAt(0).toUpperCase() + key.slice(1), // Capitaliza el primer carácter del indicador
          data: this.selectedPlantIndicators[key]
      };
  });
}

indicatorsData = [
  { key: 'energia', title: 'Energía', svg: 'assets/svgs/energia.svg' },
  { key: 'monoxidoCarbono', title: 'Monóxido de Carbono', svg: 'assets/svgs/monoxido.svg' },
  { key: 'niveles', title: 'Niveles', svg: 'assets/svgs/niveles.svg' },
  { key: 'otrosGases', title: 'Otros Gases', svg: 'assets/svgs/otros-gases.svg' },
  { key: 'presion', title: 'Presión', svg: 'assets/svgs/presion.svg' },
  { key: 'temperatura', title: 'Temperatura', svg: 'assets/svgs/temperatura.svg' },
  { key: 'tension', title: 'Tensión', svg: 'assets/svgs/tension.svg' },
  { key: 'viento', title: 'Viento', svg: 'assets/svgs/viento.svg' },
];

  countriesArray = [
    { name: 'Afganistán', code: 'AF' },
    { name: 'Albania', code: 'AL' },
    { name: 'Alemania', code: 'DE' },
    { name: 'Andorra', code: 'AD' },
    { name: 'Angola', code: 'AO' },
    { name: 'Antigua y Barbuda', code: 'AG' },
    { name: 'Arabia Saudita', code: 'SA' },
    { name: 'Argelia', code: 'DZ' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Armenia', code: 'AM' },
    { name: 'Australia', code: 'AU' },
    { name: 'Austria', code: 'AT' },
    { name: 'Azerbaiyán', code: 'AZ' },
    { name: 'Bahamas', code: 'BS' },
    { name: 'Bahrein', code: 'BH' },
    { name: 'Bangladés', code: 'BD' },
    { name: 'Barbados', code: 'BB' },
    { name: 'Bélgica', code: 'BE' },
    { name: 'Belice', code: 'BZ' },
    { name: 'Benín', code: 'BJ' },
    { name: 'Bielorrusia', code: 'BY' },
    { name: 'Bolivia', code: 'BO' },
    { name: 'Bosnia y Herzegovina', code: 'BA' },
    { name: 'Botsuana', code: 'BW' },
    { name: 'Brasil', code: 'BR' },
    { name: 'Brunéi', code: 'BN' },
    { name: 'Bulgaria', code: 'BG' },
    { name: 'Burkina Faso', code: 'BF' },
    { name: 'Burundi', code: 'BI' },
    { name: 'Cabo Verde', code: 'CV' },
    { name: 'Camerún', code: 'CM' },
    { name: 'Canadá', code: 'CA' },
    { name: 'República Centroafricana', code: 'CF' },
    { name: 'Chad', code: 'TD' },
    { name: 'Chile', code: 'CL' },
    { name: 'China', code: 'CN' },
    { name: 'Chipre', code: 'CY' },
    { name: 'Colombia', code: 'CO' },
    { name: 'Comoras', code: 'KM' },
    { name: 'Congo', code: 'CG' },
    { name: 'Congo, República Democrática del', code: 'CD' },
    { name: 'Corea del Norte', code: 'KP' },
    { name: 'Corea del Sur', code: 'KR' },
    { name: 'Costa Rica', code: 'CR' },
    { name: 'Costa de Marfil', code: 'CI' },
    { name: 'Croacia', code: 'HR' },
    { name: 'Cuba', code: 'CU' },
    { name: 'Dinamarca', code: 'DK' },
    { name: 'Dominica', code: 'DM' },
    { name: 'República Dominicana', code: 'DO' },
    { name: 'Ecuador', code: 'EC' },
    { name: 'Egipto', code: 'EG' },
    { name: 'El Salvador', code: 'SV' },
    { name: 'Emiratos Árabes Unidos', code: 'AE' },
    { name: 'Eslovaquia', code: 'SK' },
    { name: 'Eslovenia', code: 'SI' },
    { name: 'España', code: 'ES' },
    { name: 'Estados Unidos', code: 'US' },
    { name: 'Estonia', code: 'EE' },
    { name: 'Eswatini', code: 'SZ' },
    { name: 'Etiopía', code: 'ET' },
    { name: 'Fiyi', code: 'FJ' },
    { name: 'Filipinas', code: 'PH' },
    { name: 'Finlandia', code: 'FI' },
    { name: 'Francia', code: 'FR' },
    { name: 'Gambia', code: 'GM' },
    { name: 'Georgia', code: 'GE' },
    { name: 'Ghana', code: 'GH' },
    { name: 'Grecia', code: 'GR' },
    { name: 'Grenada', code: 'GD' },
    { name: 'Guatemala', code: 'GT' },
    { name: 'Guyana', code: 'GY' },
    { name: 'Guinea', code: 'GN' },
    { name: 'Guinea-Bisáu', code: 'GW' },
    { name: 'Guinea Ecuatorial', code: 'GQ' },
    { name: 'Haití', code: 'HT' },
    { name: 'Honduras', code: 'HN' },
    { name: 'Hungría', code: 'HU' },
    { name: 'Islandia', code: 'IS' },
    { name: 'India', code: 'IN' },
    { name: 'Indonesia', code: 'ID' },
    { name: 'Irán', code: 'IR' },
    { name: 'Iraq', code: 'IQ' },
    { name: 'Irlanda', code: 'IE' },
    { name: 'Islámica de Afganistán', code: 'AF' },
    { name: 'Italia', code: 'IT' },
    { name: 'Jamaica', code: 'JM' },
    { name: 'Japón', code: 'JP' },
    { name: 'Jordania', code: 'JO' },
    { name: 'Kazajistán', code: 'KZ' },
    { name: 'Kenia', code: 'KE' },
    { name: 'Kirguistán', code: 'KG' },
    { name: 'Kiribati', code: 'KI' },
    { name: 'Kuwait', code: 'KW' },
    { name: 'Laos', code: 'LA' },
    { name: 'Lesoto', code: 'LS' },
    { name: 'Letonia', code: 'LV' },
    { name: 'Líbano', code: 'LB' },
    { name: 'Liberia', code: 'LR' },
    { name: 'Libia', code: 'LY' },
    { name: 'Lituania', code: 'LT' },
    { name: 'Luxemburgo', code: 'LU' },
    { name: 'Madagascar', code: 'MG' },
    { name: 'Malasia', code: 'MY' },
    { name: 'Malawi', code: 'MW' },
    { name: 'Maldivas', code: 'MV' },
    { name: 'Malta', code: 'MT' },
    { name: 'Marruecos', code: 'MA' },
    { name: 'Mauricio', code: 'MU' },
    { name: 'Mauritania', code: 'MR' },
    { name: 'México', code: 'MX' },
    { name: 'Micronesia', code: 'FM' },
    { name: 'Mónaco', code: 'MC' },
    { name: 'Mongolia', code: 'MN' },
    { name: 'Montenegro', code: 'ME' },
    { name: 'Mozambique', code: 'MZ' },
    { name: 'Namibia', code: 'NA' },
    { name: 'Nauru', code: 'NR' },
    { name: 'Nepal', code: 'NP' },
    { name: 'Nicaragua', code: 'NI' },
    { name: 'Níger', code: 'NE' },
    { name: 'Nigeria', code: 'NG' },
    { name: 'Noruega', code: 'NO' },
    { name: 'Nueva Zelanda', code: 'NZ' },
    { name: 'Omán', code: 'OM' },
    { name: 'Pakistán', code: 'PK' },
    { name: 'Palaos', code: 'PW' },
    { name: 'Palestina', code: 'PS' },
    { name: 'Panamá', code: 'PA' },
    { name: 'Papúa Nueva Guinea', code: 'PG' },
    { name: 'Paraguay', code: 'PY' },
    { name: 'Perú', code: 'PE' },
    { name: 'Polonia', code: 'PL' },
    { name: 'Portugal', code: 'PT' },
    { name: 'Reino Unido', code: 'GB' },
    { name: 'República Checa', code: 'CZ' },
    { name: 'República del Congo', code: 'CG' },
    { name: 'Rumania', code: 'RO' },
    { name: 'Rusia', code: 'RU' },
    { name: 'Rwanda', code: 'RW' },
    { name: 'Samoa', code: 'WS' },
    { name: 'San Cristóbal y Nieves', code: 'KN' },
    { name: 'San Marino', code: 'SM' },
    { name: 'Santa Lucía', code: 'LC' },
    { name: 'Santo Tomé y Príncipe', code: 'ST' },
    { name: 'Senegal', code: 'SN' },
    { name: 'Serbia', code: 'RS' },
    { name: 'Seychelles', code: 'SC' },
    { name: 'Sierra Leona', code: 'SL' },
    { name: 'Singapur', code: 'SG' },
    { name: 'Eslovenia', code: 'SI' },
    { name: 'Somalia', code: 'SO' },
    { name: 'Sudáfrica', code: 'ZA' },
    { name: 'Sudán', code: 'SD' },
    { name: 'Sudán del Sur', code: 'SS' },
    { name: 'Suecia', code: 'SE' },
    { name: 'Suiza', code: 'CH' },
    { name: 'Siria', code: 'SY' },
    { name: 'Tailandia', code: 'TH' },
    { name: 'Tanzania', code: 'TZ' },
    { name: 'Timor Oriental', code: 'TL' },
    { name: 'Togo', code: 'TG' },
    { name: 'Tonga', code: 'TO' },
    { name: 'Trinidad y Tobago', code: 'TT' },
    { name: 'Túnez', code: 'TN' },
    { name: 'Turkmenistán', code: 'TM' },
    { name: 'Turquía', code: 'TR' },
    { name: 'Tuvalu', code: 'TV' },
    { name: 'Uganda', code: 'UG' },
    { name: 'Ucrania', code: 'UA' },
    { name: 'Uruguay', code: 'UY' },
    { name: 'Vanuatu', code: 'VU' },
    { name: 'Venezuela', code: 'VE' },
    { name: 'Vietnam', code: 'VN' },
    { name: 'Yemen', code: 'YE' },
    { name: 'Zambia', code: 'ZM' },
    { name: 'Zimbabue', code: 'ZW' }
];

}
