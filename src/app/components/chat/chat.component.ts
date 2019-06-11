import { Component, OnInit } from '@angular/core';

import { ChatService } from '../../providers/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {

	message:string = "";
	noWrite:boolean = false;
  element:any;
	inputMessage:any;

  constructor( public _cs:ChatService ) { 

  	this._cs.loadMessages()
  		.subscribe( ()=> {
  			setTimeout( ()=>{
	  			this.element.scrollTop = this.element.scrollHeight;
  			}, 20);

  		});

  }

  ngOnInit() {
  	this.element = document.getElementById('app-messages');
    this.inputMessage = document.getElementById('inputMessage');
  }

  send_message(){
  	this.noWrite = true;

  	if (this.message.length === 0) {
  		return
  	} else {
  		this._cs.addMessage(this.message)
  			.then( ()=> {
  				this.message='';
  				this.noWrite = false;
          this.inputMessage.focus();
  			})
  			.catch(err=> {
  				console.log('Error al enviar mensaje', err);
  				this.noWrite = false;
          this.inputMessage.focus();
  			});
  	}

  }

}
