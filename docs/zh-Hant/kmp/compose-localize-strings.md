# 本地化字串

本地化是將您的應用程式調整為不同語言、地區和文化習慣的過程。本指南解釋如何設定翻譯目錄、[處理特定地區格式](compose-regional-format.md)、[處理由右至左 (RTL) 語言](compose-rtl.md)，以及跨平台[測試本地化](compose-localization-tests.md)。

若要在 Compose Multiplatform 中本地化字串，您需要為應用程式的使用者介面元素提供所有支援語言的翻譯文本。Compose Multiplatform 透過提供一個共同的資源管理函式庫和程式碼產生功能，簡化了此過程，讓您能輕鬆存取翻譯。

## 設定翻譯目錄

將所有字串資源儲存在您的共享原始碼集中的專用 `composeResources` 目錄內。將預設文本放置在 `values` 目錄中，並為每種語言建立對應的目錄。使用以下結構：

```
commonMain/composeResources/
├── values/
│   └── strings.xml
├── values-es/
│   └── strings.xml
├── values-fr/
│   └── strings.xml
└── ... (other locale directories)
```

在 `values` 目錄及其本地化變體中，使用鍵值對在 `strings.xml` 檔案中定義字串資源。例如，將英文文本新增至 `commonMain/composeResources/values/strings.xml`：

```xml
<resources>
    <string name="app_name">My Application</string>
    <string name="greeting">Hello, world!</string>
    <string name="welcome_message">Welcome, %s!</string>
</resources>
```

然後，為翻譯建立對應的本地化檔案。例如，將西班牙文翻譯新增至 `commonMain/composeResources/values-es/strings.xml`：

```xml
<resources>
    <string name="app_name">Mi Aplicación</string>
    <string name="greeting">¡Hola mundo!</string>
    <string name="welcome_message">¡Bienvenido, %s!</string>
</resources>
```

## 產生用於靜態存取的類別

在您新增所有翻譯後，建置專案以產生一個提供資源存取的特殊類別。Compose Multiplatform 會處理 `composeResources` 中的 `strings.xml` 資源檔案，並為每個字串資源建立靜態存取器屬性。

產生的 `Res.strings` 物件允許您從共享程式碼中安全地存取本地化字串。若要在應用程式的使用者介面中顯示字串，請使用 `stringResource()` 可組合函數。此函數會根據使用者的當前地區設定來檢索正確的文本：

```kotlin
import project.composeapp.generated.resources.Res

@Composable
fun MyApp() {
    Text(stringResource(Res.strings.app_name))
    Text(stringResource(Res.strings.greeting))
    Text(stringResource(Res.strings.welcome_message, "User"))
}
```

在上述範例中，`welcome_message` 字串包含一個用於動態值的佔位符 (`%s`)。產生的存取器和 `stringResource()` 函數都支援傳遞此類參數。

## 接下來

*   [了解如何管理地區格式](compose-regional-format.md)
*   [閱讀有關處理由右至左語言的資訊](compose-rtl.md)