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

  previousStatus;
  // TODO para el pc, que no funciona lo de comprobar la red
  // true para pc (no comprueba la red, asume que siempre tiene internet)
  // false para movil (comprueba la red y si no hay carga los datos desde la base de datos interna)
  static beta = true;
  // static beta = false;

  constructor(public network: Network) {
    console.log('Hello NetworkProvider Provider');
    this.previousStatus = ConnectionStatusEnum.None;
  }


  public initializeNetworkEvents(): void {

    if (NetworkProvider.beta) {

      NetworkProvider.networkStatus.next(true);

    } else {

      let status = !(this.network.type == null || this.network.type == 'none');
      NetworkProvider.networkStatus.next(status);
      this.previousStatus = status ? ConnectionStatusEnum.Online : ConnectionStatusEnum.Offline;

      this.network.onDisconnect().subscribe(() => {
        if (this.previousStatus !== ConnectionStatusEnum.Offline) {
          NetworkProvider.networkStatus.next(false);
          this.previousStatus = ConnectionStatusEnum.Offline;
        }
      });

      this.network.onConnect().subscribe(() => {
        if (this.previousStatus !== ConnectionStatusEnum.Online) {
          NetworkProvider.networkStatus.next(true);
          this.previousStatus = ConnectionStatusEnum.Online;
        }
      });
    }
  }

}
