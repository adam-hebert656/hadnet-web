import { Component, OnInit } from '@angular/core';
import { BusinessListing } from '../../models/BusinessListing';
import { BusinessListingService } from 'src/app/services/business-listings/business-listing.service';
import { GetBusinessImagesService } from 'src/app/services/business-images-and-ratings/get-business-images.service';
import { BusinessProfileService } from 'src/app/services/business-profile/business-profile.service';
import {SearchService} from '../../services/search/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-listings',
  templateUrl: './business-listings.component.html',
  styleUrls: ['./business-listings.component.css']
})
export class BusinessListingsComponent implements OnInit {
  title:string;
  businessListings;
  constructor(private businessListingService: BusinessListingService, 
              private imageService: GetBusinessImagesService,
              private businessProfileService: BusinessProfileService,
              private searchService: SearchService,
              private router: Router) { }

  ngOnInit() {
    this.businessListingService.getBusinessListings().subscribe( businessListings => {
      this.businessListings = businessListings;
      console.log(this.businessListings);
      this.businessListings.forEach((business) => {
        this.imageService.getImageById(business.id)
          .subscribe((image) => {
            if (image) {
              business.ftImg = image;
            } else {
              business.ftImg = {
                url: 'https://i.imgur.com/BNtJWJM.png'
              };
            }
          });
      });
    });
  }

  checkListing(business) {
    console.log(business);
  }

  goToProfile(business) {
    this.businessProfileService.changeProfile(business);
    this.router.navigate(['/', 'business-profile']);
  }
  onSubmit() {
    this.searchService.searchForBusiness(this.title).subscribe( searchResults => {
      this.businessListings = searchResults;
      this.businessListings.forEach((business) => {
        this.imageService.getImageById(business.id)
          .subscribe((image) => {
            if (image) {
              business.ftImg = image;
            } else {
              business.ftImg = {
                url: 'https://i.imgur.com/BNtJWJM.png'
              };
            }
          });
      });
    })
  }

}
