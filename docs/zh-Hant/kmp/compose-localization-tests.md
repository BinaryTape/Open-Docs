# 本地化測試
<show-structure depth="2"/>

為了測試本地化，請驗證針對不同地區設定顯示正確的翻譯字串，並確保格式和佈局能適應地區設定的要求。

## 在不同平台上測試地區設定

### Android

在 Android 上，您可以透過 **Settings | System | Languages & input | Languages** 變更裝置的系統地區設定。對於自動化測試，您可以使用 `adb` shell 直接在模擬器上修改地區設定：

```shell
adb -e shell
setprop persist.sys.locale [BCP-47 language tag];stop;sleep 5;start
```

此命令會重新啟動模擬器，讓您以新的地區設定重新啟動應用程式。

或者，您可以在執行測試之前，使用 Espresso 等框架以程式碼方式配置地區設定。例如，您可以使用 `LocaleTestRule()` 在測試期間自動切換地區設定。

### iOS

在 iOS 上，您可以透過 **Settings | General | Language & Region** 變更裝置的系統語言和地區。對於使用 XCUITest 框架的自動化 UI 測試，請使用啟動引數來模擬地區設定變更：

```swift
app.launchArguments = [
    "-AppleLanguages", "(es)",
    "-AppleLocale", "es_ES"
]
```

### 桌面

在桌面上，JVM 地區設定通常預設為作業系統的地區設定。設定位置會因不同的桌面平台而異。

您可以在 UI 初始化之前，在測試設定或應用程式進入點中以程式碼方式設定 JVM 預設地區設定：

```java
java.util.Locale.setDefault(java.util.Locale("es_ES"))
``` 

### Web

為了快速檢查，您可以在瀏覽器偏好設定中變更語言設定。對於自動化測試，Selenium 或 Puppeteer 等瀏覽器自動化工具可以模擬地區設定變更。

或者，您可以嘗試繞過 `window.navigator.languages` 屬性的唯讀限制來引入自訂地區設定。在 [](compose-resource-environment.md) 教學課程中了解更多資訊。

## 關鍵測試情境

### 自訂地區設定

*   以程式碼方式覆寫地區設定。
*   斷言 UI 元素、格式化字串和佈局能針對選定的地區設定正確適應，包括在適用情況下處理由右至左的文字。

### 預設資源

當指定的地區設定沒有可用翻譯時，會使用預設資源。應用程式必須正確回退到這些預設值。

*   使用上述平台特定方法，將地區設定配置為不支援的值。
*   驗證回退機制是否正確載入預設資源並正確顯示它們。

### 地區設定特定案例

為了避免常見的本地化問題，請考慮以下地區設定特定案例：

*   測試[地區設定特定格式](compose-regional-format.md)，例如日期格式化（`MM/dd/yyyy` 與 `dd/MM/yyyy`）和數字格式化。
*   驗證 [RTL 與 LTR 行為](compose-rtl.md)，確保阿拉伯語和希伯來語等由右至左語言能正確顯示字串、佈局和對齊方式。