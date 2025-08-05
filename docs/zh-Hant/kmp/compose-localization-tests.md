# 本地化測試
<show-structure depth="2"/>

為了測試本地化，請驗證是否為不同的語系顯示了正確的翻譯字串，並確保格式和排版適應語系的需求。

## 在不同平台上測試語系

### Android

在 Android 上，您可以透過 **Settings | System | Languages & input | Languages** 更改裝置的系統語系。
對於自動化測試，您可以使用 `adb` shell 直接在模擬器上修改語系：

```shell
adb -e shell
setprop persist.sys.locale [BCP-47 language tag];stop;sleep 5;start
```

此命令會重新啟動模擬器，讓您可以以新的語系重新啟動應用程式。

或者，您可以在執行測試之前，使用像 Espresso 這樣的框架以程式碼方式配置語系。
例如，您可以使用 `LocaleTestRule()` 在測試期間自動化語系切換。

### iOS

在 iOS 上，您可以透過 **Settings | General | Language & Region** 更改裝置的系統語言和區域。
對於使用 XCUITest 框架的自動化 UI 測試，請使用啟動參數來模擬語系變更：

```swift
app.launchArguments = [
    "-AppleLanguages", "(es)",
    "-AppleLocale", "es_ES"
]
```

### Desktop

在桌面環境中，JVM 語系通常預設為作業系統的語系。
不同桌面平台的設定位置會有所不同。

您可以在 UI 初始化之前，在測試設定或應用程式進入點中以程式碼方式設定 JVM 預設語系：

```java
java.util.Locale.setDefault(java.util.Locale("es_ES"))
```

### Web

為了快速檢查，您可以在瀏覽器偏好設定中變更語言設定。
對於自動化測試，Selenium 或 Puppeteer 等瀏覽器自動化工具可以模擬語系變更。

或者，您可以嘗試繞過 `window.navigator.languages` 屬性的唯讀限制，以引入自訂語系。在 [](compose-resource-environment.md) 教程中了解更多資訊。

## 關鍵測試情境

### 自訂語系

*   以程式碼方式覆寫語系。
*   斷言 UI 元素、格式化字串和排版是否正確適應所選語系，包括（如果適用）處理由右至左的文字。

### 預設資源

當指定語系沒有可用翻譯時，會使用預設資源。
應用程式必須正確地回溯到這些預設值。

*   使用上述平台特定方法將語系設定為不支援的值。
*   驗證回溯機制是否正確載入預設資源並正確顯示。

### 語系特定案例

為避免常見的本地化問題，請考慮這些語系特定案例：

*   測試 [語系特定的格式](compose-regional-format.md)，例如日期格式（`MM/dd/yyyy` vs. `dd/MM/yyyy`）和數字格式。
*   驗證 [RTL 和 LTR 行為](compose-rtl.md)，確保阿拉伯語和希伯來語等由右至左的語言能正確顯示字串、排版和對齊方式。