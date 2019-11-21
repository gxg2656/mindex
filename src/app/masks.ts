import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export class Masks {
  public static readonly currency = createNumberMask({
    prefix: '$',
    allowDecimal: true
  });
}
