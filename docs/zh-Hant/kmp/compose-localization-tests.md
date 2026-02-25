# 在地化測試
<show-structure depth="2"/>

若要測試在地化，請驗證針對不同地區 (locale) 是否顯示了正確的翻譯字串，並確保格式化和配置符合該地區的需求。

## 在不同平台上測試地區

### Android

在 Android 上，您可以透過 **設定 | 系統 | 語言與輸入 | 語言** 更改裝置的系統地區。
對於自動化測試，您可以使用 `adb` shell 直接在模擬器上修改地區：

```shell
adb -e shell
setprop persist.sys.locale [BCP-47 language tag];stop;sleep 5;start
```

此指令會重新啟動模擬器，讓您能以新的地區重新啟動應用程式。

或者，您可以在執行測試之前，使用 Espresso 等架構透過程式化方式配置地區。例如，您可以使用 `LocaleTestRule()` 在測試期間自動切換地區。

### iOS

在 iOS 上，您可以透過 **設定 | 一般 | 語言與地區** 更改裝置的系統語言和區域。
對於使用 XCUITest 架構的自動化 UI 測試，請使用啟動引數來模擬地區變更：

```swift
app.launchArguments = [
    "-AppleLanguages", "(es)",
    "-AppleLocale", "es_ES"
]
```

### Desktop

在桌面平台上，JVM 地區通常預設為作業系統的地區。不同桌面平台的設定位置有所不同。

您可以在 UI 初始化之前的測試設定或應用程式入口點中，以程式化方式設定 JVM 預設地區：

```java
java.util.Locale.setDefault(java.util.Locale("es_ES"))
``` 

### Web

若要進行快速檢查，您可以更改瀏覽器偏好設定中的語言設定。
對於自動化測試，Selenium 或 Puppeteer 等瀏覽器自動化工具可以模擬地區變更。

或者，您可以嘗試繞過 `window.navigator.languages` 屬性的唯讀限制來導入自訂地區。在 [](compose-resource-environment.md) 教學中了解更多資訊。

## 關鍵測試場景

### 自訂地區

* 以程式化方式覆寫地區。
* 斷言 UI 元件、格式化字串和配置能針對所選地區正確調整，包括處理從右到左 (RTL) 的文字（如果適用）。

### 預設資源

當指定的地區沒有可用的翻譯時，會使用預設資源。應用程式必須正確回退到這些預設值。

* 使用上述平台特定方法將地區配置為不受支援的值。
* 驗證回退機制是否正確載入預設資源並正常顯示。

### 特定地區案例

為了避免常見的在地化問題，請考慮以下特定地區案例：

* 測試[特定地區的格式化](compose-regional-format.md)，例如日期格式（`MM/dd/yyyy` 與 `dd/MM/yyyy`）和數字格式。
* 驗證 [RTL 和 LTR 行為](compose-rtl.md)，確保阿拉伯語和希伯來語等從右到左的語言能正確顯示字串、配置和對齊方式。