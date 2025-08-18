# 字串在地化

在地化是調整應用程式以適應不同語言、地區和文化習俗的過程。本指南說明如何設定翻譯目錄、[處理區域特定格式](compose-regional-format.md)、[處理由右至左 (RTL) 語言](compose-rtl.md)，以及在不同平台[測試在地化](compose-localization-tests.md)。

為了在 Compose Multiplatform 中在地化字串，您需要為應用程式的使用者介面元素提供所有支援語言的翻譯文本。Compose Multiplatform 透過提供一個通用的資源管理函式庫和程式碼生成來簡化此過程，以便輕鬆存取翻譯。

## 設定翻譯目錄

將所有字串資源儲存在您的 common source set 內專用的 `composeResources` 目錄中。將預設文本放置在 `values` 目錄中，並為每種語言建立對應的目錄。使用以下結構：

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

在 `values` 目錄及其在地化變體中，使用鍵值對在 `strings.xml` 檔案中定義字串資源。例如，將英文文本新增至 `commonMain/composeResources/values/strings.xml`：

```xml
<resources>
    <string name="app_name">My Application</string>
    <string name="greeting">Hello, world!</string>
    <string name="welcome_message">Welcome, %s!</string>
</resources>
```

然後，為翻譯建立對應的在地化檔案。例如，將西班牙文翻譯新增至 `commonMain/composeResources/values-es/strings.xml`：

```xml
<resources>
    <string name="app_name">Mi Aplicación</string>
    <string name="greeting">¡Hola mundo!</string>
    <string name="welcome_message">¡Bienvenido, %s!</string>
</resources>
```

## 生成用於靜態存取的類別

一旦您新增了所有翻譯，建置專案以生成一個特殊類別，該類別提供對資源的存取。Compose Multiplatform 處理 `composeResources` 中的 `strings.xml` 資源檔案，並為每個字串資源建立靜態存取器屬性。

結果 `Res.strings` 物件讓您可以安全地從您的共享程式碼中存取在地化字串。若要在應用程式的使用者介面中顯示字串，請使用 `stringResource()` 可組合函式。此函式根據使用者的當前地區設定來檢索正確的文本：

```kotlin
import project.composeapp.generated.resources.Res

@Composable
fun MyApp() {
    Text(stringResource(Res.strings.app_name))
    Text(stringResource(Res.strings.greeting))
    Text(stringResource(Res.strings.welcome_message, "User"))
}
```

在上面的範例中，`welcome_message` 字串包含一個佔位符 (`%s`) 用於動態值。生成的存取器和 `stringResource()` 函式都支援傳遞此類參數。

## 下一步

* [學習如何管理區域格式](compose-regional-format.md)
* [閱讀有關處理由右至左語言的資訊](compose-rtl.md)