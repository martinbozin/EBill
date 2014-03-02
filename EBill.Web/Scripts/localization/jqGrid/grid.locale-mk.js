;(function($){
/**
 * jqGrid Macedonian Translation
 * Александар Миловац(Aleksandar Milovac) aleksandar.milovac@gmail.com
 * http://trirand.com/blog/
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
**/
$.jgrid = {
	defaults : {
		recordtext: "Преглед {0} - {1} од {2}",
		emptyrecords: "Не постојат записи",
		loadtext: "Вчитување...",
		pgtext : "Страна {0} од {1}"
	},
	search : {
		caption: "Пребарување...",
		Find: "Пребарува",
		Reset: "Ресетирај",
		odata : ['еднакво', 'различно од еднакво', 'помало', 'помало или еднакво','поголемо','поголемо или еднакво', 'почнува со','не почнува со','е во','не е во','завршува со','не завршува со','содржи','не содржи'],
		groupOps: [	{ op: "И", text: "сите" },	{ op: "ИЛИ",  text: "секои" }	],
		matchText: " match",
		rulesText: " правила"
	},
	edit : {
		addCaption: "Додај запис",
		editCaption: "Измени запис",
		bSubmit: "Зачувај",
		bCancel: "Откажи",
		bClose: "Затвори",
		saveData: "Податокот е изменет! Зачувај измени?",
		bYes : "Да",
		bNo : "Не",
		bExit : "Откажи",
		msg: {
			required:"Полето е задолжително",
			number:"Ве молиме, внесите точен број",
			minValue:"внесената вредноста мора да биде поголема од или еднаква со ",
			maxValue:"внесената вредноста мора да биде помала од или еднаква со",
			email: "невалидна email адреса",
			integer: "Ве молиме, внесете цел број ",
			date: "Ве молиме, внесете правилен датум",
			url: "URL-от не е корекно внесен. Потребен е префикс ('http://' or 'https://')",
			nodefined : " не е дефиниран!",
			novalue : " задолзителна повратна вредност!",
			customarray : "Custom function should return array!",
			customfcheck : "Custom function should be present in case of custom checking!"			
		}
	},
	view : {
		caption: "Прикажи рекорд",
		bClose: "Затвори"
	},
	del : {
		caption: "Избриши",
		msg: "Избриши селектиран(и) рекорд(и)?",
		bSubmit: "Избриши",
		bCancel: "Откажи"
	},
	nav : {
		edittext: "",
		edittitle: "Измени селектиран ред",
		addtext:"",
		addtitle: "Додади нов ред",
		deltext: "",
		deltitle: "Избриши селектиран ред",
		searchtext: "",
		searchtitle: "Пронајди записи",
		refreshtext: "",
		refreshtitle: "Пребарај повторно",
		alertcap: "Внимание",
		alerttext: "Ве молиме, селектирајте ред",
		viewtext: "",
		viewtitle: "Прикажи селектиран ред"
	},
	col : {
		caption: "Изберете колони",
		bSubmit: "ОК",
		bCancel: "Откажи"
	},
	errors : {
		errcap : "Грешка",
		nourl : "Не е поставен URL",
		norecords: "Нема рекорд за изработка",
		model : "Должината на моделот colNames <> colModel!"
	},
	formatter : {
		integer : {thousandsSeparator: " ", defaultValue: '0'},
		number : {decimalSeparator:".", thousandsSeparator: " ", decimalPlaces: 2, defaultValue: '0.00'},
		currency : {decimalSeparator:".", thousandsSeparator: " ", decimalPlaces: 2, prefix: "", suffix:"", defaultValue: '0.00'},
		date : {
			dayNames:   [
				"Нед", "Пон", "Вто", "Сре", "Чет", "Пет", "Саб",
				"Недела", "Понеделник", "Вторник", "Среда", "Четврток", "Петок", "Сабота"
			],
			monthNames: [
				"Јан", "Феб", "Мар", "Апр", "Мај", "Јун", "Јул", "Авг", "Сеп", "Окт", "Нов", "Дец",
				"Јануар", "Фебруар", "Март", "Април", "Мај", "Јуни", "Јули", "Август", "Септември", "Октомври", "Новември", "Декември"
			],
			AmPm : ["am","pm","AM","PM"],
			S: function (j) {return j < 11 || j > 13 ? ['st', 'nd', 'rd', 'th'][Math.min((j - 1) % 10, 3)] : 'th'},
			srcformat: 'Y-m-d',
			newformat: 'd.m.Y',
			masks : {
				ISO8601Long:"Y-m-d H:i:s",
				ISO8601Short:"Y-m-d",
				ShortDate: "n.j.Y",
				LongDate: "l, F d, Y",
				FullDateTime: "l, F d, Y g:i:s A",
				MonthDay: "F d",
				ShortTime: "g:i A",
				LongTime: "g:i:s A",
				SortableDateTime: "Y-m-d\\TH:i:s",
				UniversalSortableDateTime: "Y-m-d H:i:sO",
				YearMonth: "F, Y"
			},
			reformatAfterEdit : false
		},
		baseLinkUrl: '',
		showAction: '',
		target: '',
		checkbox : {disabled:true},
		idName : 'id'
	}
};
})(jQuery);
