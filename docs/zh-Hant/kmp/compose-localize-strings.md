# 在地化字串

在地化是指讓您的應用程式適應不同語言、地區和文化習俗的過程。
本指南說明如何設定翻譯目錄、
[處理特定地區格式](compose-regional-format.md)、
[處理由右至左 (RTL) 語言](compose-rtl.md)，
以及跨平台[測試在地化](compose-localization-tests.md)。

若要在 Compose Multiplatform 中在地化字串，您需要為應用程式支援的所有語言提供使用者介面元素的翻譯文本。Compose Multiplatform 藉由提供通用的資源管理程式庫和程式碼產生功能，讓您能輕鬆存取翻譯，進而簡化此過程。

## 設定翻譯目錄

將所有字串資源儲存在共通原始碼集中專用的 `composeResources` 目錄。
將預設文字放在 `values` 目錄，並為每種語言建立對應的目錄。
使用以下結構：

```
commonMain/composeResources/
├── values/
│   └── strings.xml
├── values-es/
│   └── strings.xml
├── values-fr/
│   └── strings.xml
└── ... (其他地區設定目錄)
```

在 `values` 目錄及其在地化變體中，使用 `strings.xml` 檔案透過鍵值對定義字串資源。
例如，將英文文字新增至 `commonMain/composeResources/values/strings.xml`：

```xml
<resources>
    <string name="app_name">My Application</string>
    <string name="greeting">Hello, world!</string>
    <string name="welcome_message">Welcome, %s!</string>
</resources>
```

接著，建立對應的在地化檔案以進行翻譯。例如，將西班牙文翻譯新增至 `commonMain/composeResources/values-es/strings.xml`：

```xml
<resources>
    <string name="app_name">Mi Aplicación</string>
    <string name="greeting">¡Hola mundo!</string>
    <string name="welcome_message">¡Bienvenido, %s!</string>
</resources>
```

## 產生靜態存取類別

新增所有翻譯後，組建專案以產生一個提供資源存取功能的特殊類別。
Compose Multiplatform 會處理 `composeResources` 中的 `strings.xml` 資源檔，並為每個字串資源建立靜態存取子屬性。

產生的 `Res.strings` 物件可讓您從共享程式碼安全地存取在地化字串。
若要在應用程式的 UI 中顯示字串，請使用 `stringResource()` Composable 函式。
此函式會根據使用者目前的地區設定檢索正確的文字：

```kotlin
import project.composeapp.generated.resources.Res

@Composable
fun MyApp() {
    Text(stringResource(Res.strings.app_name))
    Text(stringResource(Res.strings.greeting))
    Text(stringResource(Res.strings.welcome_message, "User"))
}
```

在上述範例中，`welcome_message` 字串包含一個動態值的占位符號 (`%s`)。
產生的存取子和 `stringResource()` 函式都支援傳遞此類參數。

## 下一步

* [了解如何管理地區格式](compose-regional-format.md)
* [閱讀關於處理由右至左語言的資訊](compose-rtl.md)