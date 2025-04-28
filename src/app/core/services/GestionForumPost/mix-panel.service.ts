import { Injectable } from '@angular/core';
import mixpanel from 'mixpanel-browser';

@Injectable({
  providedIn: 'root'
})
export class MixPanelService {

  constructor() {

     // Initialiser Mixpanel avec ton token
     mixpanel.init('8aebef3121fedc1bdf3ba694b980c647', { debug: true });
    }
  
    // Suivi d'un événement (ex. : "Page View")
    trackEvent(eventName: string, properties: any = {}) {
      mixpanel.track(eventName, properties);
    }
  
    // Suivi d'une vue de page
    trackPageView(pageName: string) {
      mixpanel.track('Page View', { page: pageName });
    
   }
}
