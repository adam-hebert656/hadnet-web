import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { BusinessListingService } from 'src/app/services/business-listings/business-listing.service';
import { BusinessListing } from '../../models/BusinessListing';
import { environment } from 'src/environments/environment';
declare let L;
declare let tomtom: any;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {
  // gets all business listings for rendering on map
  lat: number;
  long: number;
  loading: boolean;
  selectedBusiness: BusinessListing;
  constructor(private businessListingService: BusinessListingService) { }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
        this.renderMap();
      });
    } else {
      this.lat =  29.9511;
      this.long = -90.0715;
      this.renderMap();
    }


// initial business selected so user has an idea of what to do with the map
    this.selectedBusiness = {
      id: 123123,
      name: 'Hadnet Headquarters',
      idBusinessType: 2352354,
      phoneNumber: 5044311223,
      email: 'autoserv@yahoo.com',
      urlHomepage: 'autoserv.com',
      address: '1800 North Broad St New Orleans',
      idFeaturedImage: 235235,
      latitude: 29.9511,
      longitude:  -90.077200,
      idUser: 2352345,
      averageRating: 3,
      legalBusinessName: 'Hadnet Headquarterz',
    };
  }
  renderMap() {
    this.loading = true;
    tomtom.setProductInfo('Hadnet', '0.1');
    const map = tomtom.L.map('map', {
      key: environment.MAPS_API_KEY,
      basePath: '/assets/sdk',
      center: [ this.lat, this.long ],
      zoom: 15,
      source : 'vector'
    });
    this.businessListingService.getBusinessListings().subscribe( (businessListings) => {
      this.loading = false;
      businessListings.forEach((listing) => {
      const businessMarker: any = tomtom.L.marker([listing.latitude, listing.longitude]).addTo(map);
      // what shows up when a user clicks a pin on the map
      businessMarker.bindPopup(
        `<div>
        <strong>${listing.name}</strong><br>
        ${listing.address}<br>
        </div>`);
      businessMarker.on('click', () => {
        this.selectedBusiness = listing;
      });
    });
  });
  }
}
