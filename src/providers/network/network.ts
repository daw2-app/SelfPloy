import {Injectable} from '@angular/core';
import {Network} from '@ionic-native/network';
import {BehaviorSubject} from "rxjs";

export enum ConnectionStatusEnum {
  None,
  Online,
  Offline
}

@Injectable()
export class NetworkProvider {

  // Para saber si estas conectado a la red, no para saber el estado de la misma.
  // Almacena el ultimo valor emitido a sus consumidores, y cada vez que New Observer se suscriba,
  // recibira inmediatamente el "valor actual" del BehaviorSubject
  static networkStatus = new BehaviorSubject(false);

  currentStatus;
  static online : boolean;
  // TODO para el pc, que no funciona lo de comprobar la red
  // true para pc (no comprueba la red, asume que siempre tiene internet)
  // false para movil (comprueba la red y si no hay carga los datos desde la base de datos interna)
  // static beta = true;
  static beta = false;

  constructor(public network: Network) {
    console.log('Hello NetworkProvider Provider');
    this.currentStatus = ConnectionStatusEnum.None;
  }


  public initializeNetworkEvents(): void {

    if (NetworkProvider.beta) {

      NetworkProvider.networkStatus.next(true);
      NetworkProvider.online = true;

    } else {

      let status = !(this.network.type == null || this.network.type == 'none');
      NetworkProvider.online = status;
      NetworkProvider.networkStatus.next(status);
      this.currentStatus = status ? ConnectionStatusEnum.Online : ConnectionStatusEnum.Offline;

      this.network.onDisconnect().subscribe(() => {
        NetworkProvider.online = false;
        if (this.currentStatus !== ConnectionStatusEnum.Offline) {
          NetworkProvider.networkStatus.next(false);
          this.currentStatus = ConnectionStatusEnum.Offline;
        }
      });

      this.network.onConnect().subscribe(() => {
        NetworkProvider.online = true;
        if (this.currentStatus !== ConnectionStatusEnum.Online) {
          NetworkProvider.networkStatus.next(true);
          this.currentStatus = ConnectionStatusEnum.Online;
        }
      });
    }
  }

}
