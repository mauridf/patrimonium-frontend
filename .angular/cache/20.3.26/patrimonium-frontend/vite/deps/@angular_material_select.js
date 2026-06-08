import {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger
} from "./chunk-5WQHMVY2.js";
import "./chunk-WQCNRBYM.js";
import "./chunk-BWQ2TIA3.js";
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix
} from "./chunk-SPEOZ7QJ.js";
import {
  MatOptgroup,
  MatOption
} from "./chunk-OWLMDDKT.js";
import "./chunk-MQCSTTNL.js";
import "./chunk-EWS3GJWX.js";
import "./chunk-Q6KSVB65.js";
import "./chunk-HVZXE7RF.js";
import "./chunk-5MCOUSWZ.js";
import "./chunk-AHT3SUQM.js";
import "./chunk-FQJBWCQS.js";
import "./chunk-SMHCWY2H.js";
import "./chunk-DRGT6KVD.js";
import "./chunk-VENV3F3G.js";
import "./chunk-NCO4UOT4.js";
import "./chunk-GWFLKVBH.js";
import "./chunk-ELIBJ2KL.js";
import "./chunk-3I77VDHV.js";
import "./chunk-ODTUWKS2.js";
import "./chunk-5EG33CFQ.js";
import "./chunk-GTHGIJH6.js";
import "./chunk-IQOZX72P.js";
import "./chunk-Y7SPDI3Y.js";
import "./chunk-JE3WDOAI.js";
import "./chunk-XVQ4GNIA.js";
import "./chunk-7D2P25IJ.js";
import "./chunk-WYF26C5D.js";
import "./chunk-WDMUDEB6.js";

// node_modules/@angular/material/fesm2022/select.mjs
var matSelectAnimations = {
  // Represents
  // trigger('transformPanel', [
  //   state(
  //     'void',
  //     style({
  //       opacity: 0,
  //       transform: 'scale(1, 0.8)',
  //     }),
  //   ),
  //   transition(
  //     'void => showing',
  //     animate(
  //       '120ms cubic-bezier(0, 0, 0.2, 1)',
  //       style({
  //         opacity: 1,
  //         transform: 'scale(1, 1)',
  //       }),
  //     ),
  //   ),
  //   transition('* => void', animate('100ms linear', style({opacity: 0}))),
  // ])
  /** This animation transforms the select's overlay panel on and off the page. */
  transformPanel: {
    type: 7,
    name: "transformPanel",
    definitions: [
      {
        type: 0,
        name: "void",
        styles: {
          type: 6,
          styles: { opacity: 0, transform: "scale(1, 0.8)" },
          offset: null
        }
      },
      {
        type: 1,
        expr: "void => showing",
        animation: {
          type: 4,
          styles: {
            type: 6,
            styles: { opacity: 1, transform: "scale(1, 1)" },
            offset: null
          },
          timings: "120ms cubic-bezier(0, 0, 0.2, 1)"
        },
        options: null
      },
      {
        type: 1,
        expr: "* => void",
        animation: {
          type: 4,
          styles: { type: 6, styles: { opacity: 0 }, offset: null },
          timings: "100ms linear"
        },
        options: null
      }
    ],
    options: {}
  }
};
export {
  MAT_SELECT_CONFIG,
  MAT_SELECT_SCROLL_STRATEGY,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
  MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
  MAT_SELECT_TRIGGER,
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatOptgroup,
  MatOption,
  MatPrefix,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSelectTrigger,
  MatSuffix,
  matSelectAnimations
};
//# sourceMappingURL=@angular_material_select.js.map
