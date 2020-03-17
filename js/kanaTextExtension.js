// --------------------------------------------------------------------
// Author  : mashimonator
// Create  : 2009/10/14
// Update  : 2009/10/14
//         : 2012/05/08 IE8～でスクリプトエラーが出るバグを修正
//         : 2012/05/08 IE6でチェックボックスのデフォルトチェックが効かないバグを修正
// Description : フォームのフリガナ入力支援
// --------------------------------------------------------------------


var kntxtext = {
	//-----------------------------------------
	// constant
	//-----------------------------------------
	constant : {
		letterType : { hiragana:0, katakana:1 },
		insertType : { auto:0, check:1, checked:2, button:3 }
	},
	target : [],
	//-----------------------------------------
	// config
	//-----------------------------------------
	config : {
		labelStrHiragana : 'ふりがなを自動挿入する', // チェックボックスに表示する文字列（ひらがな）
		labelStrKatakana : 'フリガナを自動挿入する', // チェックボックスに表示する文字列（カタカナ）
		buttonStrHiragana : '名前からふりがなを挿入する', // ボタンに表示する文字列（ひらがな）
		buttonStrKatakana : '名前からフリガナを挿入する', // ボタンに表示する文字列（カタカナ）
		// not editable -->
		idBaseStr : 'kntxtext_',
		timer : null,
		elmName : null,
		elmKana : null,
		convertFlag : false,
		baseKana : '',
		ignoreString : '',
		input : '',
		values : [],
		active : true,
		kanaExtractionPattern : new RegExp('[^ 　ぁあ-んー]', 'g'),
		kanaCompactingPattern : new RegExp('[ぁぃぅぇぉっゃゅょ]', 'g')
		// <-- not editable
	},
	//-----------------------------------------
	// 初期処理
	//-----------------------------------------
	initialize : function() {
		for ( var i=0, len=kntxtext.target.length; i < len; i++ ) {
			// 対象要素を取得
			var nameStr = kntxtext.target[i][0];
			var kanaStr = kntxtext.target[i][1];
			var name = document.getElementsByName(nameStr);
			var kana = document.getElementsByName(kanaStr);
			// 挿入形式によって分岐
			switch ( kntxtext.target[i][3] ) {
				// チェックボックス生成
				case kntxtext.constant.insertType.check:
					kntxtext.createCheckBox(name[0], false);
					break;
				// チェックボックス（デフォルトチェック）生成
				case kntxtext.constant.insertType.checked:
					kntxtext.createCheckBox(name[0], true);
					break;
				// ボタン生成
				case kntxtext.constant.insertType.button:
					kntxtext.createButton(name[0]);
					break;
				default:
					break;
			}
			// イベントに関数を付加
			kntxtext.addEvent( name[0], 'focus', kntxtext.ktxFocus );
			kntxtext.addEvent( name[0], 'keydown', kntxtext.ktxKeyDown );
			kntxtext.addEvent( name[0], 'blur', kntxtext.ktxBlur );
		}
	},
	//-----------------------------------------
	// focus
	//-----------------------------------------
	ktxFocus : function( event ) {
		// 対象要素を取得
		kntxtext.config.elmName = kntxtext.getEventTarget(event);
		kntxtext.config.elmKana = kntxtext.getCorrespondingElement();
		// 入力監視の設定
		kntxtext.stateInput();
		// 入力値の監視を開始
		kntxtext.ktxSetInterval();
	},
	//-----------------------------------------
	// keyDown
	//-----------------------------------------
	ktxKeyDown : function() {
		if ( kntxtext.config.convertFlag ) {
			kntxtext.stateInput();
		}
	},
	//-----------------------------------------
	// blur
	//-----------------------------------------
	ktxBlur : function() {
		// 入力値の監視を終了
		kntxtext.ktxClearInterval();
	},
	//-----------------------------------------
	// インターバル設定
	//-----------------------------------------
	ktxSetInterval : function() {
		// 30ミリ秒毎に入力値チェックを実行
		kntxtext.config.timer = window.setInterval( kntxtext.checkValue, 30 );
	},
	//-----------------------------------------
	// インターバル解除
	//-----------------------------------------
	ktxClearInterval : function() {
		// 入力値チェックを解除
		clearInterval(kntxtext.config.timer);
	},
	//-----------------------------------------
	// 入力監視の設定（未変換）
	//-----------------------------------------
	stateInput : function() {
		var itype = kntxtext.getInsertType();
		switch ( itype ) {
			case kntxtext.constant.insertType.button:
				kntxtext.config.baseKana = kntxtext.config.elmKana.value;
				break;
		}
		kntxtext.config.convertFlag = false;
		kntxtext.config.ignoreString = kntxtext.config.elmName.value;
		switch ( itype ) {
			case kntxtext.constant.insertType.check:
			case kntxtext.constant.insertType.checked:
				var checkbox = document.getElementById(new String(kntxtext.config.idBaseStr + kntxtext.config.elmName.name));
				if ( checkbox && checkbox.checked ) {
					kntxtext.config.active = true;
				} else {
					kntxtext.config.active = false;
				}
				break;
			case kntxtext.constant.insertType.button:
				kntxtext.config.active = false;
				break;
			default:
				kntxtext.config.active = true;
				break;
		}
	},
	//-----------------------------------------
	// 入力監視の設定（変換済み）
	//-----------------------------------------
	stateConvert : function() {
		kntxtext.config.baseKana = new String(kntxtext.config.baseKana + kntxtext.config.values.join(''));
		kntxtext.config.convertFlag = true;
		kntxtext.config.values = [];
	},
	//-----------------------------------------
	// 入力監視の設定をクリア
	//-----------------------------------------
	stateClear : function() {
		kntxtext.config.baseKana = '';
		kntxtext.config.convertFlag = false;
		kntxtext.config.ignoreString = '';
		kntxtext.config.input = '';
		kntxtext.config.values = [];
	},
	//-----------------------------------------
	// 入力値チェック
	//-----------------------------------------
	checkValue : function() {
		// 入力値を取得
		var newInput = kntxtext.config.elmName.value;
		switch ( newInput ) {
			case '':
				// 入力値が空の場合はリセット
				kntxtext.stateClear();
				kntxtext.setKana();
				break;
			default:
				// 入力値から変換非対称の文字列を除いた値を取得
				newInput = kntxtext.removeString(newInput);
				switch ( newInput ) {
					case kntxtext.config.input:
						// 前回の入力値と同じなら返す
						return;
						break;
					default:
						// 入力値の履歴として保持
						kntxtext.config.input = newInput;
						if ( !kntxtext.config.convertFlag ) {
							// 未変換なら変換処理を行う
							var newValues = newInput.replace(kntxtext.config.kanaExtractionPattern,'').split('');
							kntxtext.checkConvert(newValues);
							kntxtext.setKana(newValues);
						}
						break;
				}
				break;
		}
	},
	//-----------------------------------------
	// 変換チェック
	//-----------------------------------------
	checkConvert : function( newValues ) {
		if ( !kntxtext.config.convertFlag ) {
			var x = kntxtext.config.values.length - newValues.length;
			var i = (x ^ (x >> 31)) - (x >> 31);
			switch ( true ) {
				case i > 1:
					var tmpValues = newValues.join('').replace(kntxtext.config.kanaCompactingPattern,'').split('');
					var y = kntxtext.config.values.length - tmpValues.length;
					var z = (y ^ (y >> 31)) - (y >> 31);
					if ( z > 1 ) {
						kntxtext.stateConvert();
					}
					break;
				default:
					if ( kntxtext.config.values.length == kntxtext.config.input.length && kntxtext.config.values.join('') != kntxtext.config.inputactive ) {
						kntxtext.stateConvert();
					}
					break;
			}
		}
	},
	//-----------------------------------------
	// カナinput要素に値を挿入
	//-----------------------------------------
	setKana : function( newValues ) {
		if ( !kntxtext.config.convertFlag ) {
			if( newValues ) {
				kntxtext.config.values = newValues;
			}
			if( kntxtext.config.active ) {
				kntxtext.config.elmKana.value = kntxtext.toKatakana( new String(kntxtext.config.baseKana + kntxtext.config.values.join('')) );
			}
		}
	},
	//-----------------------------------------
	// 入力値をカタカナに変換する
	//-----------------------------------------
	toKatakana : function( src ) {
		switch ( kntxtext.getLetterType() ) {
			case kntxtext.constant.letterType.katakana:
				var str = new String;
				for( var i=0, len=src.length; i<len; i++ ) {
					var c = src.charCodeAt(i);
					switch ( kntxtext.isHiragana(c) ) {
						case true:
							str += String.fromCharCode(c + 96);
							break;
						default:
							str += src.charAt(i);
							break;
					}
				}
				return str;
				break;
			default:
				return src;
				break;
		}
	},
	//-----------------------------------------
	// ひらがな判定
	//-----------------------------------------
	isHiragana : function( char ) {
		return ((char >= 12353 && char <= 12435) || char == 12445 || char == 12446);
	},
	//-----------------------------------------
	// 文字列から変換非対称の値を削除して返す
	//-----------------------------------------
	removeString : function( newInput ) {
		if ( newInput.match(kntxtext.config.ignoreString) ) {
			return newInput.replace(kntxtext.config.ignoreString,'');
		} else {
			var ignoreArray = kntxtext.config.ignoreString.split('');
			var inputArray = newInput.split('');
			for( var i=0, len=ignoreArray.length; i<len; i++ ) {
				switch (ignoreArray[i]) {
					case inputArray[i]:
						inputArray[i] = '';
						break;
				}
			}
			return inputArray.join('');
		}
	},
	//-----------------------------------------
	// 対象input要素の横にチェックボックスを追加する
	//-----------------------------------------
	createCheckBox: function( element, flag ) {
		var parent = element.parentNode;
		var div = kntxtext.createBlock();
		var checkbox = kntxtext.createInputCheckbox(element, flag);
		var label = kntxtext.createLabel(element);
		parent.replaceChild(div, element);
		div.appendChild(element);
		div.appendChild(checkbox);
		checkbox.checked = flag;
		div.appendChild(label);
	},
	//-----------------------------------------
	// ブロックを生成する
	//-----------------------------------------
	createBlock : function() {
		var div = document.createElement('div');
		div.style.margin = '0px';
		div.style.padding = '0px';
		div.style.border = 'none';
		div.style.background = 'transparent';
		div.style.display = 'inline';
		return div;
	},
	//-----------------------------------------
	// チェックボックスを生成する
	//-----------------------------------------
	createInputCheckbox: function( element, flag ) {
		var input = document.createElement('input');
		input.type = 'checkbox';
		if ( element.id ) {
			input.id = element.id;
		} else {
			input.id = new String(kntxtext.config.idBaseStr + element.name);
		}
		input.style.border = 'none';
		input.style.background = 'transparent';
		input.style.cursor = 'pointer';
		input.style.marginLeft = '5px';
		return input;
	},
	//-----------------------------------------
	// ラベルを生成する
	//-----------------------------------------
	createLabel: function( element ) {
		var label = document.createElement('label');
		if ( element.id ) {
			label.htmlFor = element.id;
		} else {
			label.htmlFor = new String(kntxtext.config.idBaseStr + element.name);
		}
		label.style.cursor = 'pointer';
		if ( !kntxtext.getLetterType(element) ) {
			label.innerHTML = kntxtext.config.labelStrHiragana;
		} else {
			label.innerHTML = kntxtext.config.labelStrKatakana;
		}
		return label;
	},
	//-----------------------------------------
	// 対象input要素の横にボタンを追加する
	//-----------------------------------------
	createButton: function( element ) {
		var parent = element.parentNode;
		var div = kntxtext.createBlock();
		var button = kntxtext.createInputButton(element);
		parent.replaceChild(div, element);
		div.appendChild(element);
		div.appendChild(button);
	},
	//-----------------------------------------
	// ボタンを生成する
	//-----------------------------------------
	createInputButton: function( element ) {
		var input = document.createElement('input');
		input.type = 'button';
		if ( element.id ) {
			input.id = element.id;
		} else {
			input.id = new String(kntxtext.config.idBaseStr + element.name);
		}
		input.style.margin = '0px';
		input.style.marginLeft = '5px';
		if ( !kntxtext.getLetterType(element) ) {
			input.value = kntxtext.config.buttonStrHiragana;
		} else {
			input.value = kntxtext.config.buttonStrKatakana;
		}
		input.onclick = function() {
			if ( kntxtext.config.elmName ) {
				if ( this.id == (kntxtext.config.idBaseStr + kntxtext.config.elmName.name) ) {
					kntxtext.config.elmKana.value = kntxtext.toKatakana( new String(kntxtext.config.baseKana + kntxtext.config.values.join('')) );
				}
			}
		};
		return input;
	},
	//-----------------------------------------
	// 名前input要素に対応するカナinput要素を返す
	//-----------------------------------------
	getCorrespondingElement : function() {
		var result = null;
		var element = kntxtext.config.elmName;
		if ( element ) {
			for ( var i=0, len=kntxtext.target.length; i < len; i++ ) {
				if ( element.name.match(kntxtext.target[i][0]) ) {
					result = document.getElementsByName(kntxtext.target[i][1]);
					result = result[0];
					break;
				}
			}
		}
		return result;
	},
	//-----------------------------------------
	// 名前input要素に対応する文字種を返す
	//-----------------------------------------
	getLetterType : function( element ) {
		var result = 0;
		if ( !element ) {
			element = kntxtext.config.elmName;
		}
		for ( var i=0, len=kntxtext.target.length; i < len; i++ ) {
			if ( element.name.match(kntxtext.target[i][0]) ) {
				result = kntxtext.target[i][2];
				break;
			}
		}
		return result;
	},
	//-----------------------------------------
	// 名前input要素に対応する入力形式を返す
	//-----------------------------------------
	getInsertType : function( element ) {
		var result = 0;
		if ( !element ) {
			element = kntxtext.config.elmName;
		}
		for ( var i=0, len=kntxtext.target.length; i < len; i++ ) {
			if ( element.name.match(kntxtext.target[i][0]) ) {
				result = kntxtext.target[i][3];
				break;
			}
		}
		return result;
	},
	//-----------------------------------------
	// イベント発生元の要素を取得
	//-----------------------------------------
	getEventTarget : function( event ) {
		var element = null;
		if ( event && event.target ) {
			element = event.target;
		} else if ( window.event && window.event.srcElement ) {
			element = window.event.srcElement;
		}
		return element;
	},
	getTargetElements : function( tag, cls ) {
		var elements = new Array();
		var targetElements = document.getElementsByTagName(tag.toUpperCase());
		for ( var i = 0, len = targetElements.length; i < len; i++ ) {
			if ( targetElements[i].className.match(cls) ) {
				elements[elements.length] = targetElements[i];
			}
		}
		return elements;
	},
	addEvent : function( target, event, func ) {
		try {
			target.addEventListener(event, func, false);
		} catch (e) {
			target.attachEvent(new String('on' + event), (function(el){return function(){func.call(el);};})(target));
		}
	}
}
// set target input elements
kntxtext.target = [
	[ 'name_1', 'read_1', kntxtext.constant.letterType.hiragana, kntxtext.constant.insertType.auto ],
	[ 'name_2', 'read_2', kntxtext.constant.letterType.hiragana, kntxtext.constant.insertType.auto ]
];
// exec
kntxtext.addEvent( window, 'load', kntxtext.initialize );