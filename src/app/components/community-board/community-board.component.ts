import { Component, OnInit } from '@angular/core';
import { CommunityListingsService } from '../../services/community-listings/community-listings.service';
import { CommunityListing } from 'src/app/models/CommunityListing';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-community-board',
  templateUrl: './community-board.component.html',
  styleUrls: ['./community-board.component.css']
})
export class CommunityBoardComponent implements OnInit {
  loggedIn: boolean;
  allListings: CommunityListing[];
  title: any;
  body: any;
  dateExpire: any;
  idUser: any;
  imageUrl: any;
  constructor(private communityListingsService: CommunityListingsService,
              public authService: AuthService) { }

  ngOnInit() {
    // testing all the functions
    // this.addListing('bbq', 'come to my backyard barbecue', '2019-05-12',
    // 'https://cdn.stockphotosecrets.com/wp-content/uploads/2018/08/hide-the-pain-stockphoto-840x560.jpg');
    // this.searchForListings('bb');
    // this.getAllListings();
    // this.removeListing(12, 2);
    this.getAllListings();
  }

    // dateExpire needs a format of '2019-05-12'
  addListing(title, body, dateExpire, imageUrl) {
    // const idUser = this.authService.currentLocalUser.id;
      // this.loggedIn = true;
      return this.communityListingsService.addCommunityListing(title, body, imageUrl, dateExpire, this.authService.currentLocalUser.id)
      .subscribe(addedListing => this.getAllListings());
  }

  removeListing(listingId, idUser) {
    return this.communityListingsService.removeCommunityListing(listingId, idUser)
    .subscribe(removedListing => {
      // after this, get all listings
    });
  }

  getAllListings() {
    // assign this to state and *ngFor over all this data to display community listings
    return this.communityListingsService.getAllCommunityListings()
    .subscribe(allListings => this.allListings = allListings );
  }

  searchForListings(title) {
    return this.communityListingsService.searchForCommunityListings(title)
    .subscribe(searchResults => {});
  }
  eventForm() {

  }
  addEvent(title, body, dateExpire, imageUrl): void {

    this.addListing(title, body, dateExpire, imageUrl);


  }
}
