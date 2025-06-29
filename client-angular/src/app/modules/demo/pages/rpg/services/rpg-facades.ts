import { Injectable } from '@angular/core';

import { AdventureFacade } from './facades/adventure-facade';
import { AttributeFacade } from './facades/attribute-facade';
import { CharacterFacade } from './facades/character-facade';
import { ItemFacade } from './facades/item-facade';
import { LocationFacade } from './facades/location-facade';
import { MomentFacade } from './facades/moment-facade';

@Injectable({ providedIn: 'root' })
export class RpgFacades {
  constructor(
    public adventure: AdventureFacade,
    public attribute: AttributeFacade,
    public character: CharacterFacade,
    public item: ItemFacade,
    public location: LocationFacade,
    public moment: MomentFacade,
    // ...add more as needed
  ) {}
}
