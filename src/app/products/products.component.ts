import { Component, Inject, OnInit, ViewChild, Input } from '@angular/core';
import { Hero } from '../modules/heroes/shared/hero.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { I18n } from '@ngx-translate/i18n-polyfill';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';

import { CookieService } from '@gorniv/ngx-universal';

import {ProductsService} from '../shared/services/products.service'
import { FormsModule } from '@angular/forms';



  
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products :any = [];
  fakeArray: any[];
  newProdForm: FormGroup;
  canVote = false;
  error: boolean;
  selected: any ={_id:null,   nom:'',prix: 0 ,qte:0 };
 name:string
 prix:number
 qte:number
 @Input() prodData = {   nom:'',prix: 0 ,qte:0 };
 durationInSeconds = 5;
 searchText:string

  @ViewChild('form', { static: false }) myNgForm; // just to call resetForm method
  counter: any;

  constructor(
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private router: Router,
              private i18n: I18n,
              private formBuilder: FormBuilder,
              private cookieService: CookieService,
              public prod_service:ProductsService,
              private _snackBar: MatSnackBar
              ) {


    this.newProdForm = this.formBuilder.group({
      nom: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      prix: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      qte: new FormControl('', [Validators.required, Validators.maxLength(30)])
    });

   
  }

  ngOnInit() {
    this.getProducts(1)
   
   
  }

	getProducts(x) {
		
		this.prod_service.getProducts(x).subscribe((data:{}) => {
		  console.log(data);
      this.products = data
      this.fakeArray= new Array(this.products.totalPages)

		});
    }
    
    show(ch){
      this.selected=ch
      console.log(this.selected)
    }
    deleteProd(id) {
      this.prod_service.deleteProduct(id)
        .subscribe( data => {
          this.getProducts(1)
          this._snackBar.open("Produit supprimé", "OK", {
            duration: 2000,
          });
        })
    };
    UpdateProd(id,prod) {
      if(this.selected.nom=="" || this.selected.prix==null || this.selected.qte == null ||  isNaN (this.selected.prix) || isNaN(this.selected.qte)){
        this._snackBar.open("Verifier vos saisies !", "OK", {
          duration: 2000,
        });}
        else{
      this.prod_service.UpdateProduct(id,prod)
        .subscribe( data => {
          this.getProducts(1)
          this._snackBar.open("Produit modifié", "OK", {
            duration: 2000,
          });
          this.selected.nom=""
          this.selected.prix=null
          this.selected.qte=null
          this.selected._id=null
          
        })}
    };
    addProduct() {
      this.prodData.nom=this.name
      this.prodData.prix=this.prix
      this.prodData.qte=this.qte
      if(this.name=="" || this.prix==null || this.qte == null ||  isNaN (this.prix) || isNaN(this.qte)){
        this._snackBar.open("Verifier vos saisies !", "OK", {
          duration: 2000,
        });
      }else{


      this.prod_service.addProduct(this.prodData).subscribe((result) => {
        this.name=null
        this.prix=null
        this.qte=null
        this.getProducts(1)
        this._snackBar.open("Produit ajouté", "OK", {
          duration: 2000,
        });
     

      }, (err) => {
        console.log(err);
      });
    }
    }

    show_list(x){
      console.log(x);
      this.getProducts(x)
      this.counter=x;
      
    }
    next(){
      if(this.counter< this.fakeArray.length) this.counter++;
      this.show_list(this.counter)
  
    }
    previous(){
      if (this.counter>1)this.counter--;
      this.show_list(this.counter)
    }
  

  trackByFn(index: any) {
    return index;
  }

  

}
