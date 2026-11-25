# LG QA: повторная подача v2.1.3

Issue: **TVAPPQA-67425_74309** · приложение **Museum at Home** · ID `com.saborrr.museumathome`.

## Статус и причина

В предыдущей версии Back в корне галереи напрямую закрывал приложение, без
подтверждения выхода. В v2.1.3 добавлен собственный диалог подтверждения:
**Stay / Остаться** получает фокус по умолчанию; **Exit / Выйти** завершает
приложение только после явного выбора и подтверждения. Повторный Back отменяет
диалог. Back в меню коллекций/настроек и в подробностях картины только закрывает
текущую панель, не вызывает выход.

Собственный диалог — допустимый вариант по официальной документации
[LG Back Button](https://webostv.developer.lge.com/develop/guides/back-button).
`disableBackHistoryAPI: true` сохраняется; приложение обрабатывает Back само.
Для webOS `window.close()` вызывается только после подтверждения **Exit**.

**Физический LG с v2.1.3 еще не проверен.** Историческое подтверждение установки
и работы галереи на LG49UH610V / webOS 3.4 относится к v2.1.2, а не к этому
исправлению. Автотесты не заменяют аппаратную проверку.

Оба пакета собраны официальным `ares-package` 3.2.6 и проверены распаковкой:

- `dist/museum-at-home-webos-1080-2.1.3.ipk`: 73 142 360 байт,
  SHA-256 `516c51220c0ec4f2f37392e3acf65b925362212e8fcf0a93acbf407d832738e4`.
- `dist/museum-at-home-webos-720-2.1.3.ipk`: 73 142 418 байт,
  SHA-256 `f3077e4be843e0d0e50bd982b38a94a76924114db8c8f62a5938ebbe4e027fa7`.

96 автоматических тестов и проверки check/validate/build:platforms:strict прошли;
отдельно в Chromium с webOS user agent проверены popup, Stay, Back из панелей и
явный Exit на 1080p/720p. Это не аппаратный тест. Пакеты пока не опубликованы.
В Seller Lounge был выполнен вход и прочитана заявка с двумя пакетами 2.1.2,
но при продолжении сессия сбросилась, повторная авторизация LG стала зависать.
Загрузка новых пакетов и повторная отправка пока не подтверждены.

## Чеклист перед повторной подачей

- [ ] Запустить `npm run check`, `npm run validate`, `npm run build:platforms:strict`;
  приложить фактические результаты, дату и коммит проверяемого исходного кода.
- [ ] Собрать webOS 1080p и упаковать официальным `ares-package`.
- [ ] Проверить внутри готового IPK: ID `com.saborrr.museumathome`, версия `2.1.3`,
  разрешение `1920x1080`, наличие диалога выхода и нового обработчика Back.
- [ ] Записать точное имя файла, размер в байтах и SHA-256 готового IPK.
- [ ] Установить именно этот IPK на физический LG, записать модель, версию webOS,
  способ установки и дату. Проверить обновление поверх прежней версии без
  предварительного удаления приложения.
- [ ] В корне галереи нажать Back один раз: приложение остается открытым,
  появляется диалог, фокус на **Stay / Остаться**.
- [ ] Нажать OK на **Stay / Остаться**: диалог закрывается, галерея продолжает работу.
- [ ] Снова открыть диалог и нажать Back: диалог отменяется, приложение не закрывается.
- [ ] Открыть диалог, перейти пультом на **Exit / Выйти**, нажать OK: приложение
  закрывается только после этого действия; повторный запуск работает.
- [ ] Открыть меню коллекций/настроек и нажать Back: закрывается только меню.
  Следующий Back в галерее открывает подтверждение выхода.
- [ ] Открыть подробности картины и нажать Back: закрываются только подробности.
  Следующий Back в галерее открывает подтверждение выхода.
- [ ] Проверить D-pad и Magic Remote, видимый фокус и клики по обеим кнопкам;
  повторить проверки в RU и EN. Проверить, что диалог не пропадает при автоскрытии UI.
- [ ] Снять короткое видео: Back в галерее → Stay по умолчанию → отмена Back;
  отдельно подтвержденный Exit и закрытие меню/подробностей без выхода.
- [ ] Загрузить проверенный IPK в Seller Lounge для повторной проверки по
  **TVAPPQA-67425_74309**, приложить видео и английское пояснение ниже.
- [ ] Прочитать обратно карточку отправки: версия, имя загруженного файла,
  issue и статус. Зафиксировать подтверждение отправки; не считать отправку
  успешной только по нажатию кнопки.

## English text for LG QA

Suggested response for issue **TVAPPQA-67425_74309** (use with the actual v2.1.3
submission; this draft does not assert that a package has already been uploaded):

> The issue was caused by the previous Back handler closing the application
> directly from the main gallery without asking the user to confirm the exit.
>
> In version 2.1.3, pressing Back on the main gallery opens a custom exit
> confirmation popup, as permitted by the LG webOS TV Back Button guide.
> “Stay” is focused by default. Selecting “Stay” or pressing Back again cancels
> the popup and keeps the gallery running. The application closes only when
> the user explicitly selects “Exit” and confirms it.
>
> When the collection/settings menu or the artwork details panel is open,
> Back only dismisses the current panel and returns to the gallery. It does
> not close the application or open an exit popup in the same action.
>
> Please retest the Back behavior in version 2.1.3 for issue
> TVAPPQA-67425_74309. The expected flow is: main gallery → Back → confirmation
> popup with “Stay” selected; Back or “Stay” → gallery; explicit “Exit” → close.

Не добавлять к ответу утверждение «tested on LG» до выполнения аппаратного
чеклиста; модель, webOS, видео и сведения об IPK добавлять только по факту.
