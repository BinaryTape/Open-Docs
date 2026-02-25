# 本地化测试
<show-structure depth="2"/>

为了测试本地化，请验证在不同区域设置 (locale) 下是否显示了正确的翻译字符串，并确保格式设置和布局能够适应区域设置的要求。

## 在不同平台上测试区域设置

### Android

在 Android 上，你可以通过 **设置 | 系统 | 语言和输入法 | 语言** 更改设备的系统区域设置。
对于自动化测试，你可以使用 `adb` shell 直接在模拟器上修改区域设置：

```shell
adb -e shell
setprop persist.sys.locale [BCP-47 language tag];stop;sleep 5;start
```

此命令将重新启动模拟器，从而允许你使用新区域设置重新启动应用。

或者，你可以在运行测试之前使用 Espresso 等框架以编程方式配置区域设置。
例如，你可以使用 `LocaleTestRule()` 在测试期间自动切换区域设置。

### iOS

在 iOS 上，你可以通过 **设置 | 通用 | 语言与地区** 更改设备的系统语言和地区。
对于使用 XCUITest 框架的自动化 UI 测试，请使用启动参数来模拟区域设置更改：

```swift
app.launchArguments = [
    "-AppleLanguages", "(es)",
    "-AppleLocale", "es_ES"
]
```

### 桌面端

在桌面端，JVM 区域设置通常默认为操作系统的区域设置。
不同桌面平台的设置位置有所不同。

你可以在 UI 初始化之前的测试设置或应用程序入口点中，以编程方式设置 JVM 默认区域设置：

```java
java.util.Locale.setDefault(java.util.Locale("es_ES"))
``` 

### Web

为了进行快速检查，你可以更改浏览器偏好设置中的语言设置。
对于自动化测试，Selenium 或 Puppeteer 等浏览器自动化工具可以模拟区域设置更改。 

或者，你可以尝试绕过 `window.navigator.languages` 属性的只读限制，以引入自定义区域设置。在 [](compose-resource-environment.md) 教程中了解详情。

## 关键测试场景

### 自定义区域设置

* 以编程方式重写区域设置。
* 断言 UI 元素、格式化后的字符串和布局对于所选区域设置是否适配正确，包括在适用时处理从右到左 (right-to-left) 的文本。

### 默认资源

当指定区域设置没有可用翻译时，将使用默认资源。应用程序必须能够正确回退到这些默认值。

* 使用上述平台特定方法将区域设置配置为不支持的值。
* 验证回退机制是否正确加载默认资源并妥善显示。

### 区域设置特定案例

为避免常见的本地化问题，请考虑以下特定区域设置的情况：

* 测试 [区域特定格式设置](compose-regional-format.md)，例如日期格式设置 (`MM/dd/yyyy` 与 `dd/MM/yyyy`) 和数字格式设置。
* 验证 [RTL 和 LTR 行为](compose-rtl.md)，确保像阿拉伯语和希伯来语这类从右到左的语言能正确显示字符串、布局和对齐。