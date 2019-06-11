import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Message } from '../interfaces/message.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

	private itemsCollection: AngularFirestoreCollection<Message>;
	public chats:Message[] = [];
  public user:any = {};

  constructor( private afs: AngularFirestore,
                public afAuth: AngularFireAuth ) {

    this.afAuth.authState.subscribe( user => {
      if (!user) {
        return
      }

      this.user.name = user.displayName;
      this.user.uid = user.uid;
    });


  }

  login(provider:string) {
    if (provider==='google') {
      this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    } else {
      this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider());
    }
  }
  logout() {
    this.user = {};
    this.afAuth.auth.signOut();
  }

  loadMessages(){

  	this.itemsCollection = this.afs.collection<Message>('chats', ref => ref.orderBy('date', 'desc').limit(5) );
  	
  	return this.itemsCollection.valueChanges()
  		.pipe(map( ( messages:Message[] ) =>{
  			this.chats = [];

  			for (let message of messages) {
  				this.chats.unshift( message );
  			}

  			return this.chats;
  		}));

  }

  addMessage( text:string ){

  	let message:Message = {
  		name: this.user.name,
  		message: text,
      uid: this.user.uid,
  		date: new Date().getTime(),
  	}

  	return this.itemsCollection.add(message);

  }
}
