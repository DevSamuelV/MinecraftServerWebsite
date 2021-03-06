import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from "@angular/fire/firestore";
import { ServerDoc, FormDoc } from "../models/Models";

import { map } from "rxjs/operators";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UIService {

  private offline: boolean = false;
  private online: boolean = true;
  private mantainace: boolean = false;

  private servers: Observable<ServerDoc[]>;
  private serverCollection: AngularFirestoreCollection<ServerDoc>;
  private formsCollection: AngularFirestoreCollection<FormDoc>;

  constructor(private afs: AngularFirestore) {

    this.serverCollection = afs.collection("minecraftservers");
    this.formsCollection = afs.collection("minecraftServersWebsiteForms");

    this.servers = this.serverCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
      const data = a.payload.doc.data() as ServerDoc;
      data.id = a.payload.doc.id;
      return data;
    })))
  }

  public async sendData(ServerName: string, ServerIssue: string) {
    const formdata: FormDoc = {
      serverName: ServerName,
      serverInfo: ServerIssue,
      time: new Date().getUTCDate.toString()
    }

    await this.formsCollection.add(formdata);
  }

  getServers() {
    return this.servers;
  }

  setOnline() {
    this.offline = false;
    this.online = true;
    this.mantainace = false;
  }

  setMantainace() {
    this.offline = false;
    this.online = false;
    this.mantainace = true;
  }

  setOffline() {
    this.offline = true;
    this.online = false;
    this.mantainace = false;
  }
}
