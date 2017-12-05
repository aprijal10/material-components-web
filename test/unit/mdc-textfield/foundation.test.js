/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import td from 'testdouble';

import {verifyDefaultAdapter} from '../helpers/foundation';
import MDCTextFieldFoundation from '../../../packages/mdc-textfield/foundation';
import MDCTextFieldBottomLineFoundation from '../../../packages/mdc-textfield/bottom-line/foundation';

const {cssClasses} = MDCTextFieldFoundation;

suite('MDCTextFieldFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCTextFieldFoundation);
});

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTextFieldFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTextFieldFoundation, [
    'addClass', 'removeClass', 'addClassToLabel', 'removeClassFromLabel',
    'registerTextFieldInteractionHandler', 'deregisterTextFieldInteractionHandler',
    'registerInputInteractionHandler', 'deregisterInputInteractionHandler',
    'registerBottomLineEventHandler', 'deregisterBottomLineEventHandler',
    'getNativeInput',
  ]);
});

const setupTest = () => {
  const mockAdapter = td.object(MDCTextFieldFoundation.defaultAdapter);
  const bottomLine = td.object({
    activate: () => {},
    deactivate: () => {},
    setTransformOrigin: () => {},
    handleTransitionEnd: () => {},
  });
  const helperText = td.object({
    setContent: () => {},
    showToScreenReader: () => {},
    setValidity: () => {},
  });
  const icon = td.object({
    setDisabled: () => {},
    handleTextFieldInteraction: () => {},
  });
  const foundationMap = {
    bottomLine: bottomLine,
    helperText: helperText,
    icon: icon,
  };
  const foundation = new MDCTextFieldFoundation(mockAdapter, foundationMap);
  return {foundation, mockAdapter, bottomLine, helperText, icon};
};

test('#constructor sets disabled to false', () => {
  const {foundation} = setupTest();
  assert.isNotOk(foundation.isDisabled());
});

test('#setDisabled flips disabled when a native input is given', () => {
  const {foundation, mockAdapter} = setupTest();
  const nativeInput = {disabled: false};
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.setDisabled(true);
  assert.isOk(foundation.isDisabled());
});

test('#setDisabled has no effect when no native input is provided', () => {
  const {foundation} = setupTest();
  foundation.setDisabled(true);
  assert.isNotOk(foundation.isDisabled());
});

test('#setDisabled set the disabled property on the native input when there is one', () => {
  const {foundation, mockAdapter} = setupTest();
  const nativeInput = {disabled: false};
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.setDisabled(true);
  assert.isOk(nativeInput.disabled);
});

test('#setDisabled handles no native input being returned gracefully', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeInput()).thenReturn(null);
  assert.doesNotThrow(() => foundation.setDisabled(true));
});

test('#setDisabled adds mdc-text-field--disabled when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.addClass(cssClasses.DISABLED));
});

test('#setDisabled removes mdc-text-field--invalid when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.removeClass(cssClasses.INVALID));
});

test('#setDisabled removes mdc-text-field--disabled when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(false);
  td.verify(mockAdapter.removeClass(cssClasses.DISABLED));
});

test('#setDisabled sets disabled on icon', () => {
  const {foundation, icon} = setupTest();
  foundation.setDisabled(true);
  td.verify(icon.setDisabled(true));
});

test('#setValid adds mdc-textfied--invalid when set to false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setValid(false);
  td.verify(mockAdapter.addClass(cssClasses.INVALID));
});

test('#setValid removes mdc-textfied--invalid when set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setValid(true);
  td.verify(mockAdapter.removeClass(cssClasses.INVALID));
});

test('#init adds mdc-text-field--upgraded class', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  td.verify(mockAdapter.addClass(cssClasses.UPGRADED));
});

test('#init adds event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();

  td.verify(mockAdapter.registerInputInteractionHandler('focus', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInputInteractionHandler('blur', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInputInteractionHandler('input', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInputInteractionHandler('mousedown', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerInputInteractionHandler('touchstart', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTextFieldInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerTextFieldInteractionHandler('keydown', td.matchers.isA(Function)));
  td.verify(mockAdapter.registerBottomLineEventHandler(
    MDCTextFieldBottomLineFoundation.strings.ANIMATION_END_EVENT, td.matchers.isA(Function)));
});

test('#destroy removes event listeners', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.destroy();

  td.verify(mockAdapter.deregisterInputInteractionHandler('focus', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInputInteractionHandler('blur', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInputInteractionHandler('input', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInputInteractionHandler('mousedown', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterInputInteractionHandler('touchstart', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterTextFieldInteractionHandler('click', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterTextFieldInteractionHandler('keydown', td.matchers.isA(Function)));
  td.verify(mockAdapter.deregisterBottomLineEventHandler(
    MDCTextFieldBottomLineFoundation.strings.ANIMATION_END_EVENT, td.matchers.isA(Function)));
});

test('#init adds mdc-text-field__label--float-above class if the input contains a value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeInput()).thenReturn({
    value: 'Pre-filled value',
    disabled: false,
    checkValidity: () => true,
  });
  foundation.init();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE));
});

test('#init does not add mdc-text-field__label--float-above class if the input does not contain a value', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNativeInput()).thenReturn({
    value: '',
    disabled: false,
    checkValidity: () => true,
  });
  foundation.init();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE), {times: 0});
});

test('#setHelperTextContent sets the content of the helper text element', () => {
  const {foundation, helperText} = setupTest();
  foundation.setHelperTextContent('foo');
  td.verify(helperText.setContent('foo'));
});

test('on input focuses if input event occurs without any other events', () => {
  const {foundation, mockAdapter} = setupTest();
  let input;

  td.when(mockAdapter.registerInputInteractionHandler('input', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      input = handler;
    });
  foundation.init();
  input();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE));
});

test('on input does nothing if input event preceded by keydown event', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockEvt = {
    type: 'keydown',
    key: 'Enter',
  };
  const mockInput = {
    disabled: false,
  };
  let keydown;
  let input;

  td.when(mockAdapter.getNativeInput()).thenReturn(mockInput);
  td.when(mockAdapter.registerTextFieldInteractionHandler('keydown', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      keydown = handler;
    });
  td.when(mockAdapter.registerInputInteractionHandler('input', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      input = handler;
    });
  foundation.init();
  keydown(mockEvt);
  input();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE), {times: 0});
});

test('on focus adds mdc-text-field--focused class', () => {
  const {foundation, mockAdapter} = setupTest();
  let focus;
  td.when(mockAdapter.registerInputInteractionHandler('focus', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      focus = handler;
    });
  foundation.init();
  focus();
  td.verify(mockAdapter.addClass(cssClasses.FOCUSED));
});

test('on focus adds mdc-text-field__label--float-above class', () => {
  const {foundation, mockAdapter} = setupTest();
  let focus;
  td.when(mockAdapter.registerInputInteractionHandler('focus', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      focus = handler;
    });
  foundation.init();
  focus();
  td.verify(mockAdapter.addClassToLabel(cssClasses.LABEL_FLOAT_ABOVE));
});

test('on focus makes helper text visible to the screen reader', () => {
  const {foundation, mockAdapter, helperText} = setupTest();
  let focus;
  td.when(mockAdapter.registerInputInteractionHandler('focus', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      focus = handler;
    });
  foundation.init();
  focus();
  td.verify(helperText.showToScreenReader());
});

const setupBlurTest = () => {
  const {foundation, mockAdapter, helperText} = setupTest();
  let blur;
  td.when(mockAdapter.registerInputInteractionHandler('blur', td.matchers.isA(Function))).thenDo((evtType, handler) => {
    blur = handler;
  });
  const nativeInput = {
    value: '',
    checkValidity: () => true,
  };
  td.when(mockAdapter.getNativeInput()).thenReturn(nativeInput);
  foundation.init();

  return {foundation, mockAdapter, blur, nativeInput, helperText};
};

test('on blur removes mdc-text-field--focused class', () => {
  const {mockAdapter, blur} = setupBlurTest();
  blur();
  td.verify(mockAdapter.removeClass(cssClasses.FOCUSED));
});

test('on blur removes mdc-text-field__label--float-above when no input value present', () => {
  const {mockAdapter, blur} = setupBlurTest();
  blur();
  td.verify(mockAdapter.removeClassFromLabel(cssClasses.LABEL_FLOAT_ABOVE));
});

test('on blur does not remove mdc-text-field__label--float-above if input has a value', () => {
  const {mockAdapter, blur, nativeInput} = setupBlurTest();
  nativeInput.value = 'non-empty value';
  blur();
  td.verify(mockAdapter.removeClassFromLabel(cssClasses.LABEL_FLOAT_ABOVE), {times: 0});
});

test('on blur removes mdc-text-field--invalid if custom validity is false and' +
     'input.checkValidity() returns true', () => {
  const {mockAdapter, blur} = setupBlurTest();
  blur();
  td.verify(mockAdapter.removeClass(cssClasses.INVALID));
});

test('on blur adds mdc-textfied--invalid if custom validity is false and' +
     'input.checkValidity() returns false', () => {
  const {mockAdapter, blur, nativeInput} = setupBlurTest();
  nativeInput.checkValidity = () => false;
  blur();
  td.verify(mockAdapter.addClass(cssClasses.INVALID));
});

test('on blur does not remove mdc-text-field--invalid if custom validity is true and' +
     'input.checkValidity() returns true', () => {
  const {foundation, mockAdapter, blur} = setupBlurTest();
  foundation.setValid(false);
  blur();
  td.verify(mockAdapter.removeClass(cssClasses.INVALID), {times: 0});
});

test('on blur does not add mdc-textfied--invalid if custom validity is true and' +
     'input.checkValidity() returns false', () => {
  const {foundation, mockAdapter, blur, nativeInput} = setupBlurTest();
  nativeInput.checkValidity = () => false;
  foundation.setValid(true);
  blur();
  td.verify(mockAdapter.addClass(cssClasses.INVALID), {times: 0});
});

test('on blur set validity of helper text', () => {
  const {blur, nativeInput, helperText} = setupBlurTest();
  nativeInput.checkValidity = () => false;
  blur();
  td.verify(helperText.setValidity(false));
});

test('on blur handles getNativeInput() not returning anything gracefully', () => {
  const {mockAdapter, blur} = setupBlurTest();
  td.when(mockAdapter.getNativeInput()).thenReturn(null);
  assert.doesNotThrow(blur);
});

test('on text field click proxies to icon event handler if event target is an icon', () => {
  const {foundation, mockAdapter, icon} = setupTest();
  const evt = {
    target: {},
    type: 'click',
  };
  const mockInput = {
    disabled: false,
  };
  let iconEventHandler;

  td.when(mockAdapter.getNativeInput()).thenReturn(mockInput);
  td.when(mockAdapter.registerTextFieldInteractionHandler('click', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      iconEventHandler = handler;
    });

  foundation.init();
  iconEventHandler(evt);
  td.verify(icon.handleTextFieldInteraction(evt));
});

test('on transition end deactivates the bottom line if this.isFocused_ is false', () => {
  const {foundation, mockAdapter, bottomLine} = setupTest();
  const mockEvt = {
    propertyName: 'opacity',
  };
  let transitionEnd;

  td.when(mockAdapter.registerBottomLineEventHandler(td.matchers.isA(String), td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      transitionEnd = handler;
    });

  foundation.init();
  transitionEnd(mockEvt);

  td.verify(bottomLine.deactivate());
});

test('mousedown on the input sets the bottom line origin', () => {
  const {foundation, mockAdapter, bottomLine} = setupTest();
  const mockEvt = {
    target: {
      getBoundingClientRect: () => {
        return {};
      },
    },
    clientX: 200,
    clientY: 200,
  };

  let clickHandler;

  td.when(mockAdapter.registerInputInteractionHandler('mousedown', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      clickHandler = handler;
    });

  foundation.init();
  clickHandler(mockEvt);

  td.verify(bottomLine.setTransformOrigin(mockEvt));
});

test('touchstart on the input sets the bottom line origin', () => {
  const {foundation, mockAdapter, bottomLine} = setupTest();
  const mockEvt = {
    target: {
      getBoundingClientRect: () => {
        return {};
      },
    },
    clientX: 200,
    clientY: 200,
  };

  let clickHandler;

  td.when(mockAdapter.registerInputInteractionHandler('touchstart', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      clickHandler = handler;
    });

  foundation.init();
  clickHandler(mockEvt);

  td.verify(bottomLine.setTransformOrigin(mockEvt));
});

test('interacting with text field does not emit custom events if input is disabled', () => {
  const {foundation, mockAdapter, icon} = setupTest();
  const mockEvt = {
    target: {},
    key: 'Enter',
  };
  const mockInput = {
    disabled: true,
  };
  let textFieldInteraction;

  td.when(mockAdapter.getNativeInput()).thenReturn(mockInput);
  td.when(mockAdapter.registerTextFieldInteractionHandler('keydown', td.matchers.isA(Function)))
    .thenDo((evt, handler) => {
      textFieldInteraction = handler;
    });

  foundation.init();
  textFieldInteraction(mockEvt);

  td.verify(icon.handleTextFieldInteraction(mockEvt), {times: 0});
});
