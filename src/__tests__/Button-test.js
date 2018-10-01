/**
 * # Header-test.js
 * 
 * This class tests that the Header component displays correctly
 *
 * *Note:* if you want to understand the structures here, add a
 * ```console.log``` and then ```npm test```.
 *
 */
/*global jest describe it expect*/
'use strict';

jest.autoMockOff();

/**
* ## Imports
*/
import React, { View, TouchableOpacity } from 'react-native';
import utils from 'react-addons-test-utils';

/**
 * ## Under test
 * class under test
 */
jest.dontMock('../Button');
var Button = require('../Button');

/**
 * ## Test
 */
describe('Button', () => {
  
  /**
   * ### renderHeader
   * display component and return 
   * @returns {Object} with props, output and renderer
   */ 

  function renderButton(props) {
    const renderer = utils.createRenderer();
    renderer.render(<Button {...props}/>);
    const output = renderer.getRenderOutput();

    return {
      props,
      output,
      renderer
    };
  }
  /**
   * ### it should be display empty text when not fetching
   * render the header when not fetching
   */    
  it('should be display empty text when not fetching', () => {
    const {output} = renderButton({
      text: 'Woohoo'
    });
    expect(output.type).toEqual(TouchableOpacity);
    expect(output.props.children[0].type).toEqual(View);
    //expect(output.props.children[0].props.children[1].props.children).toEqual(' ');

  });
  /**
   * ### it should be display spinner when fetching
   * When fetching, the GiftedSpinner should display
   */    
  /*it('should be display spinner when fetching', () => {
    const buttonProps = {
      isFetching: true
    };
    header = renderHeader(buttonProps);
    const {output} = header;

    expect(output.type).toEqual(View);
    expect(output.props.children[0].props.children[1].type.displayName).toEqual('GiftedSpinner');
  });*/

});//describe Header