import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


// Iniciar la aplicación
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));