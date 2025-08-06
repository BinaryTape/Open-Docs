# 本地化测试
<show-structure depth="2"/>

为了测试本地化，请验证是否为不同的区域设置显示了正确的翻译字符串，并确保格式和布局适应区域设置的要求。

## 在不同平台测试区域设置

### Android

在 Android 上，您可以通过 **设置 | 系统 | 语言和输入法 | 语言** 更改设备的系统区域设置。
对于自动化测试，您可以使用 `adb` shell 直接在模拟器上修改区域设置：

```shell
adb -e shell
setprop persist.sys.locale [BCP-47 language tag];stop;sleep 5;start
```

此命令将重启模拟器，允许您以新的区域设置重新启动应用。

或者，您可以在运行测试前，使用 Espresso 等框架以编程方式配置区域设置。例如，您可以使用 `LocaleTestRule()` 在测试期间自动化区域设置切换。

### iOS

在 iOS 上，您可以通过 **设置 | 通用 | 语言与区域** 更改设备的系统语言和区域。
对于使用 XCUITest 框架的自动化 UI 测试，请使用启动实参来模拟区域设置变更：

```swift
app.launchArguments = [
    "-AppleLanguages", "(es)",
    "-AppleLocale", "es_ES"
]
```

### Desktop

在桌面端，JVM 区域设置通常默认为操作系统的区域设置。
设置位置因不同的桌面平台而异。

您可以在 UI 初始化之前，在测试设置或应用程序入口点中以编程方式设置 JVM 默认区域设置：

```java
java.util.Locale.setDefault(java.util.Locale("es_ES"))
``` 

### Web

为了快速检查，您可以在浏览器偏好设置中更改语言设置。
对于自动化测试，Selenium 或 Puppeteer 等浏览器自动化工具可以模拟区域设置变更。

或者，您可以尝试绕过 `window.navigator.languages` 属性的只读限制以引入自定义区域设置。
更多内容请参阅 [](compose-resource-environment.md) 教程。

## 关键测试场景

### 自定义区域设置

*   以编程方式覆盖区域设置。
*   断言 UI 元素、格式化字符串和布局是否正确适应所选区域设置，包括在适用情况下处理从右到左文本。

### 默认资源

当指定区域设置没有可用翻译时，将使用默认资源。
应用程序必须正确回退到这些默认值。

*   使用上述平台特有的方法将区域设置配置为不支持的值。
*   验证回退机制是否正确加载默认资源并正确显示它们。

### 区域设置特有的情况

为避免常见的本地化问题，请考虑以下区域设置特有的情况：

*   测试 [区域设置特有的格式化](compose-regional-format.md)，例如日期格式化（`MM/dd/yyyy` vs. `dd/MM/yyyy`）和数字格式化。
*   验证 [RTL 和 LTR 行为](compose-rtl.md)，确保阿拉伯语和希伯来语等从右到左语言正确显示字符串、布局和对齐方式。