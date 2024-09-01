import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { initializeApp } from 'firebase/app';

initializeApp(environment.firebaseConfig);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
