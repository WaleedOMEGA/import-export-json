import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import  *  as  data  from  '../data.json';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  invoiceForm:FormGroup;
  itemForm:FormGroup;
  dataSource:itemDto[]=[];
  invoice:invoiceDto;
  displayedColumns: string[] = ['desc', 'qty', 'unitPrice','total','delete'];
  @ViewChild('table') table: MatTable<itemDto>;
  subtotal:number =0;
  subTotalLessDiscount:number=0;
  totalTax:number=0;
  shipping:number=0;
  del:boolean=true;
  constructor(private formBuilder: FormBuilder) {
    this.invoice = new invoiceDto();
    this.invoiceForm = this.formBuilder.group({
      CompanyName:[''],
      address:[''],
      zipCode: [''],
      date: [''],
      receiptNo: [''],
      contactName: [''],
      clientCompanyName: [''],
      billAddress:[''],
      phone: [''],
      email:[''],
      nameDept:[''],
      shipClientCompanyName:[''],
      shipAddress:[''],
      shipPhone:[''],
      notes:[''],
      subTotal:[''],
      discount:[''],
      subLessDiscount:[''],
      taxRate:[''],
      totalTax:[''],
      shipping:[''],
      balancePaid:['']
      });
      this.itemForm=this.formBuilder.group({
        description:[''],
        qty:[''],
        unitPrice:[''],
        total:['']
      })
   }

  ngOnInit(): void {
    this.itemForm.controls['total'].disable();
    this.invoiceForm.controls['subTotal'].disable();
    this.invoiceForm.controls['subLessDiscount'].disable();
    this.invoiceForm.controls['totalTax'].disable();
    this.invoiceForm.controls['balancePaid'].disable();
  }
  calcTotal(){
    let qty = this.itemForm.controls['qty'].value;
    let unitPrice = this.itemForm.controls['unitPrice'].value;
    this.itemForm.controls['total'].setValue(qty * unitPrice);
  }
  calcDiscount(){
    let subTotal = this.invoiceForm.controls['subTotal'].value;
    let discount =this.invoiceForm.controls['discount'].value;
    this.subTotalLessDiscount =subTotal - discount;
    this.invoiceForm.controls['subLessDiscount'].setValue(this.subTotalLessDiscount);
    let totalTax = this.invoiceForm.controls['totalTax'].value;
    let shipping = this.invoiceForm.controls['shipping'].value;
    this.invoiceForm.controls['balancePaid'].setValue(this.subTotalLessDiscount + totalTax + shipping);
  }
  calcTax(){
    let tax = this.invoiceForm.controls['taxRate'].value;
    let subLessDiscount = this.invoiceForm.controls['subLessDiscount'].value;
    let totalTax = subLessDiscount * (tax/100);
    let shipping = this.invoiceForm.controls['shipping'].value;
    this.invoiceForm.controls['balancePaid'].setValue(this.subTotalLessDiscount + totalTax + shipping);
    this.invoiceForm.controls['totalTax'].setValue(subLessDiscount * (tax/100));
  }
  calcShipping(){
    let shipping = parseInt(this.invoiceForm.controls['shipping'].value);
    let subLessDiscount = this.invoiceForm.controls['subLessDiscount'].value;
    let totalTax = this.invoiceForm.controls['totalTax'].value;
    this.invoiceForm.controls['balancePaid'].setValue(shipping + subLessDiscount + totalTax)
  }
  addItem(){
    this.dataSource.push({
      description : this.itemForm.controls['description'].value,
      qty : this.itemForm.controls['qty'].value,
      unitPrice : this.itemForm.controls['unitPrice'].value,
      total : this.itemForm.controls['total'].value
    })
    this.subtotal +=this.itemForm.controls['total'].value;
    this.invoiceForm.controls['subTotal'].setValue(this.subtotal);
    let discount = this.invoiceForm.controls['discount'].value;
    this.subTotalLessDiscount =this.subtotal-discount;
    this.invoiceForm.controls['subLessDiscount'].setValue(this.subTotalLessDiscount);
    let totalTax = this.invoiceForm.controls['totalTax'].value;
    let shipping = this.invoiceForm.controls['shipping'].value;
    this.invoiceForm.controls['balancePaid'].setValue(this.subTotalLessDiscount + totalTax + shipping)
    if(this.table){
      this.table.renderRows();
    }
    this.itemForm.reset();
  }
  deleteRow(i:number){
    this.subtotal -=this.dataSource[i].total;
    this.invoiceForm.controls['subTotal'].setValue(this.subtotal);
    let discount = this.invoiceForm.controls['discount'].value;
    this.subTotalLessDiscount =this.subtotal-discount;
    this.invoiceForm.controls['subLessDiscount'].setValue(this.subTotalLessDiscount);
    let totalTax = this.invoiceForm.controls['totalTax'].value;
    let shipping = this.invoiceForm.controls['shipping'].value;
    this.invoiceForm.controls['balancePaid'].setValue(this.subTotalLessDiscount + totalTax + shipping)
    this.dataSource.splice(i, 1);
    this.table.renderRows();
  }
  export(){
    this.invoice ={
  CompanyName:this.invoiceForm.controls['CompanyName'].value,
  address:this.invoiceForm.controls['address'].value,
  zipCode:this.invoiceForm.controls['zipCode'].value,
  date:this.invoiceForm.controls['date'].value,
  receiptNo:this.invoiceForm.controls['receiptNo'].value,
  contactName:this.invoiceForm.controls['contactName'].value,
  clientCompanyName:this.invoiceForm.controls['clientCompanyName'].value,
  billAddress:this.invoiceForm.controls['billAddress'].value,
  phone:this.invoiceForm.controls['phone'].value,
  email:this.invoiceForm.controls['email'].value,
  nameDept:this.invoiceForm.controls['nameDept'].value,
  shipClientCompanyName:this.invoiceForm.controls['shipClientCompanyName'].value,
  shipAddress:this.invoiceForm.controls['shipAddress'].value,
  shipPhone:this.invoiceForm.controls['shipPhone'].value,
  notes:this.invoiceForm.controls['notes'].value,
  subTotal:this.invoiceForm.controls['subTotal'].value,
  discount:this.invoiceForm.controls['discount'].value,
  subLessDiscount:this.invoiceForm.controls['subLessDiscount'].value,
  taxRate:this.invoiceForm.controls['taxRate'].value,
  totalTax:this.invoiceForm.controls['totalTax'].value,
  shipping:this.invoiceForm.controls['shipping'].value,
  balancePaid:this.invoiceForm.controls['balancePaid'].value,
  items:this.dataSource
    }
    let dataStr = JSON.stringify(this.invoice);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'data.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
  import(){
    this.del=false;
  let d : any=data;
  this.invoice=d.default;
  
  this.invoiceForm.controls['CompanyName'].setValue(this.invoice.CompanyName);
  this.invoiceForm.controls['address'].setValue(this.invoice.address);
  this.invoiceForm.controls['zipCode'].setValue(this.invoice.zipCode);
  this.invoiceForm.controls['date'].setValue(this.invoice.date);
  this.invoiceForm.controls['receiptNo'].setValue(this.invoice.receiptNo);
  this.invoiceForm.controls['contactName'].setValue(this.invoice.contactName);
  this.invoiceForm.controls['clientCompanyName'].setValue(this.invoice.clientCompanyName);
  this.invoiceForm.controls['billAddress'].setValue(this.invoice.billAddress);
  this.invoiceForm.controls['phone'].setValue(this.invoice.phone);
  this.invoiceForm.controls['email'].setValue(this.invoice.email);
  this.invoiceForm.controls['nameDept'].setValue(this.invoice.nameDept);
  this.invoiceForm.controls['shipClientCompanyName'].setValue(this.invoice.shipClientCompanyName);
  this.invoiceForm.controls['shipAddress'].setValue(this.invoice.shipAddress);
  this.invoiceForm.controls['shipPhone'].setValue(this.invoice.shipPhone);
  this.invoiceForm.controls['notes'].setValue(this.invoice.notes);
  this.invoiceForm.controls['subTotal'].setValue(this.invoice.subTotal);
  this.subtotal=this.invoice.subTotal;
  this.invoiceForm.controls['discount'].setValue(this.invoice.discount);
  this.invoiceForm.controls['subLessDiscount'].setValue(this.invoice.subLessDiscount);
  this.invoiceForm.controls['taxRate'].setValue(this.invoice.taxRate);
  this.invoiceForm.controls['totalTax'].setValue(this.invoice.totalTax);
  this.invoiceForm.controls['shipping'].setValue(this.invoice.shipping);
  this.invoiceForm.controls['balancePaid'].setValue(this.invoice.balancePaid);
  this.dataSource =this.invoice.items;
  if(this.table){
    this.table.renderRows();
  }

    
  }
}
export class itemDto {
  description?:string;
  qty?:string;
  unitPrice?:string;
  total?:number
}
export class invoiceDto {
  CompanyName?:string;
  address?:string;
  zipCode?:string;
  date?:string;
  receiptNo?:string;
  contactName?:string;
  clientCompanyName?:string;
  billAddress?:string;
  phone?:string;
  email?:string;
  nameDept?:string;
  shipClientCompanyName?:string;
  shipAddress?:string;
  shipPhone?:string;
  notes?:string;
  subTotal?:number;
  discount?:string;
  subLessDiscount?:number;
  taxRate?:string;
  totalTax?:number;
  shipping?:string;
  balancePaid?:number;
  items?:itemDto[];
}
