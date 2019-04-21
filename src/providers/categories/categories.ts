import { Injectable } from '@angular/core';
import { faHammer, faKey, faLaptop, faLightbulb, faPaintRoller, faShower } from "@fortawesome/free-solid-svg-icons";

@Injectable()
export class CategoriesProvider {

  static categories = [
    {'count': 0, 'name':'hammer',       'icon': faHammer,      'title': 'Carpenters',   'filter': 'carpenter'},
    {'count': 0, 'name':'lightbulb',    'icon': faLightbulb,   'title': 'Electricians', 'filter': 'electrician'},
    {'count': 0, 'name':'laptop',       'icon': faLaptop,      'title': 'Computers',    'filter': 'computer'},
    {'count': 0, 'name':'paint-roller', 'icon': faPaintRoller, 'title': 'Painters',     'filter': 'painter'},
    {'count': 0, 'name':'shower',       'icon': faShower,      'title': 'Plumbers',     'filter': 'plumber'},
    {'count': 0, 'name':'key',          'icon': faKey,         'title': 'Locksmiths',   'filter': 'locksmith'}
  ];

  constructor() {
    console.log('Hello CategoriesProvider Provider');
  }

  public getCategories() {
    return CategoriesProvider.categories;
  }

}
