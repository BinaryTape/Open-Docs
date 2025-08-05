[//]: # (title: 与 UIKit framework 的集成)

<show-structure depth="3"/>

Compose Multiplatform 可与 [UIKit](https://developer.apple.com/documentation/uikit) framework 互操作。你可以在 UIKit application 中嵌入 Compose Multiplatform，也可以在 Compose Multiplatform 中嵌入原生 UIKit 组件。本页面提供了在 UIKit application 中使用 Compose Multiplatform 以及在 Compose Multiplatform UI 中嵌入 UIKit 组件的示例。

> 要了解 SwiftUI 互操作性，请参阅 [](compose-swiftui-integration.md) 文章。
>
{style="tip"}

## 在 UIKit application 中使用 Compose Multiplatform

要在 UIKit application 中使用 Compose Multiplatform，请将你的 Compose Multiplatform 代码添加到任何 [container view controller](https://developer.apple.com/documentation/uikit/view_controllers) 中。以下示例在 `UITabBarController` 类中使用了 Compose Multiplatform：

```swift
let composeViewController = Main_iosKt.ComposeOnly()
composeViewController.title = "Compose Multiplatform inside UIKit"

let anotherViewController = UIKitViewController()
anotherViewController.title = "UIKit"

// Set up the UITabBarController
let tabBarController = UITabBarController()
tabBarController.viewControllers = [
    // Wrap the created ViewControllers in a UINavigationController to set titles
    UINavigationController(rootViewController: composeViewController),
    UINavigationController(rootViewController: anotherViewController)
]
tabBarController.tabBar.items?[0].title = "Compose"
tabBarController.tabBar.items?[1].title = "UIKit"
```

使用此代码，你的应用程序应如下所示：

![UIKit](uikit.png){width=300}

请在[示例项目](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-compose-in-uikit)中探索此代码。

## 在 Compose Multiplatform 中使用 UIKit

要在 Compose Multiplatform 中使用 UIKit 元素，请将你想要使用的 UIKit 元素添加到 Compose Multiplatform 的 [UIKitView](https://github.com/JetBrains/compose-multiplatform-core/blob/47c012bfe2d4570fb08432253298b8e2b6e38ade/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/interop/UIKitView.uikit.kt) 中。你可以纯粹使用 Kotlin 编写此代码，也可以使用 Swift。

### 地图视图

你可以使用 UIKit 的 [`MKMapView`](https://developer.apple.com/documentation/mapkit/mkmapview) 组件在 Compose Multiplatform 中实现地图视图。通过使用 Compose Multiplatform 的 `Modifier.size()` 或 `Modifier.fillMaxSize()` 函数来设置组件大小：

```kotlin
UIKitView(
    factory = { MKMapView() },
    modifier = Modifier.size(300.dp),
)
```

使用此代码，你的应用程序应如下所示：

![MapView](mapview.png){width=300}

现在，让我们来看一个高级示例。此代码在 Compose Multiplatform 中封装了 UIKit 的 [`UITextField`](https://developer.apple.com/documentation/uikit/uitextfield/)：

```kotlin
@OptIn(ExperimentalForeignApi::class)
@Composable
fun UseUITextField(modifier: Modifier = Modifier) {
    // Holds the state of the text in Compose
    var message by remember { mutableStateOf("Hello, World!") }

    UIKitView(
        factory = {
            // Creates a UITextField integrated with Compose state
            val textField = object : UITextField(CGRectMake(0.0, 0.0, 0.0, 0.0)) {
                @ObjCAction
                fun editingChanged() {
                    // Updates the Compose state when text changes in UITextField
                    message = text ?: ""
                }
            }
            // Adds a listener for text changes within the UITextField
            textField.addTarget(
                target = textField,
                action = NSSelectorFromString(textField::editingChanged.name),
                forControlEvents = UIControlEventEditingChanged
            )
            textField
        },
        modifier = modifier.fillMaxWidth().height(30.dp),
        update = { textField ->
            // Updates UITextField text from Compose state
            textField.text = message
        }
    )
}
```

*   `factory` 参数包含 `editingChanged()` 函数和 `textField.addTarget()` 监听器，用于检测 `UITextField` 的任何变化。
*   `editingChanged()` 函数使用 `@ObjCAction` 注解，使其可以与 Objective-C 代码互操作。
*   `addTarget()` 函数的 `action` 参数传递了 `editingChanged()` 函数的名称，以响应 `UIControlEventEditingChanged` 事件来触发它。
*   当可观察的消息状态改变其值时，`UIKitView()` 的 `update` 参数会被调用。
*   该函数更新 `UITextField` 的 `text` 属性，以便用户看到更新后的值。

请在我们的[示例项目](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-uikit-in-compose)中探索此示例的代码。

### 摄像头视图

你可以使用 UIKit 的 [`AVCaptureSession`](https://developer.apple.com/documentation/avfoundation/avcapturesession) 和 [`AVCaptureVideoPreviewLayer`](https://developer.apple.com/documentation/avfoundation/avcapturevideopreviewlayer) 组件在 Compose Multiplatform 中实现摄像头视图。

这允许你的应用程序访问设备的摄像头并显示实时预览。

以下是实现基本摄像头视图的示例：

```kotlin
UIKitView(
    factory = {
        val session = AVCaptureSession().apply {
            val device = AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeVideo)!!
            val input = AVCaptureDeviceInput.deviceInputWithDevice(device, null)!!
            addInput(input)
        }
        val previewLayer = AVCaptureVideoPreviewLayer(session)
        session.startRunning()

        object : UIView() {
            override fun layoutSubviews() {
                super.layoutSubviews()
                previewLayer.frame = bounds
            }
        }.apply {
            layer.addSublayer(previewLayer)
        }
    },
    modifier = Modifier.size(300.dp)
)
```

现在，让我们来看一个高级示例。此代码拍摄照片，附加 GPS 元数据，并使用原生 `UIView` 显示实时预览：

```kotlin
@OptIn(ExperimentalForeignApi::class)
@Composable
fun RealDeviceCamera(
    camera: AVCaptureDevice,
    onCapture: (picture: PictureData.Camera, image: PlatformStorableImage) -> Unit
) {
    // Initializes AVCapturePhotoOutput for photo capturing
    val capturePhotoOutput = remember { AVCapturePhotoOutput() }
    // ...
    // Defines a delegate to capture callback: process image data, attach GPS, setup onCapture
    val photoCaptureDelegate = remember {
        object : NSObject(), AVCapturePhotoCaptureDelegateProtocol {
            override fun captureOutput(
                output: AVCapturePhotoOutput,
                didFinishProcessingPhoto: AVCapturePhoto,
                error: NSError?
            ) {
                val photoData = didFinishProcessingPhoto.fileDataRepresentation()
                if (photoData != null) {
                    val gps = locationManager.location?.toGps() ?: GpsPosition(0.0, 0.0)
                    val uiImage = UIImage(photoData)
                    onCapture(
                        createCameraPictureData(
                            name = nameAndDescription.name,
                            description = nameAndDescription.description,
                            gps = gps
                        ),
                        IosStorableImage(uiImage)
                    )
                }
                capturePhotoStarted = false
            }
        }
    }
    // ...
    // Sets up AVCaptureSession for photo capture
    val captureSession: AVCaptureSession = remember {
        AVCaptureSession().also { captureSession ->
            captureSession.sessionPreset = AVCaptureSessionPresetPhoto
            val captureDeviceInput: AVCaptureDeviceInput =
                deviceInputWithDevice(device = camera, error = null)!!
            captureSession.addInput(captureDeviceInput)
            captureSession.addOutput(capturePhotoOutput)
        }
    }
    // Sets up AVCaptureVideoPreviewLayer for the live camera preview
    val cameraPreviewLayer = remember {
        AVCaptureVideoPreviewLayer(session = captureSession)
    }
    // ...
    // Creates a native UIView with the native camera preview layer
    UIKitView(
        modifier = Modifier.fillMaxSize().background(Color.Black),
        factory = {
            val cameraContainer = object: UIView(frame = CGRectZero.readValue()) {
                override fun layoutSubviews() {
                    CATransaction.begin()
                    CATransaction.setValue(true, kCATransactionDisableActions)
                    layer.setFrame(frame)
                    cameraPreviewLayer.setFrame(frame)
                    CATransaction.commit()
                }
            }
            cameraContainer.layer.addSublayer(cameraPreviewLayer)
            cameraPreviewLayer.videoGravity = AVLayerVideoGravityResizeAspectFill
            captureSession.startRunning()
            cameraContainer
        },
    )
    // ...
    // Creates a Compose button that executes the capturePhotoWithSettings callback when pressed
    CircularButton(
        imageVector = IconPhotoCamera,
        modifier = Modifier.align(Alignment.BottomCenter).padding(36.dp),
        enabled = !capturePhotoStarted,
    ) {
        capturePhotoStarted = true
        val photoSettings = AVCapturePhotoSettings.photoSettingsWithFormat(
            format = mapOf(AVVideoCodecKey to AVVideoCodecTypeJPEG)
        )
        if (camera.position == AVCaptureDevicePositionFront) {
            capturePhotoOutput.connectionWithMediaType(AVMediaTypeVideo)
                ?.automaticallyAdjustsVideoMirroring = false
            capturePhotoOutput.connectionWithMediaType(AVMediaTypeVideo)
                ?.videoMirrored = true
        }
        capturePhotoOutput.capturePhotoWithSettings(
            settings = photoSettings,
            delegate = photoCaptureDelegate
        )
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="val capturePhotoOutput = remember { AVCapturePhotoOutput() }"}

`RealDeviceCamera` 可组合函数执行以下任务：

*   使用 `AVCaptureSession` 和 `AVCaptureVideoPreviewLayer` 设置原生摄像头预览。
*   创建一个 `UIKitView`，它托管一个自定义 `UIView` 子类，该子类管理布局更新并嵌入预览层。
*   初始化 `AVCapturePhotoOutput` 并配置委托以处理照片拍摄。
*   使用 `CLLocationManager` (通过 `locationManager`) 检索拍摄时的 GPS 坐标。
*   将拍摄的图像转换为 `UIImage`，将其封装为 `PlatformStorableImage`，并通过 `onCapture` 提供诸如名称、描述和 GPS 位置等元数据。
*   显示一个圆形可组合按钮用于触发拍摄。
*   在使用前置摄像头时应用镜像设置，以匹配自然的自拍行为。
*   在 `layoutSubviews()` 中使用 `CATransaction` 动态更新预览布局，以避免动画。

> 要在真实设备上测试，你需要将 `NSCameraUsageDescription` 键添加到你的应用的 `Info.plist` 文件中。如果没有它，应用程序将在运行时崩溃。
>
{style="note"}

请在 [ImageViewer 示例项目](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)中探索此示例的完整代码。

### 网页视图

你可以使用 UIKit 的 [`WKWebView`](https://developer.apple.com/documentation/webkit/wkwebview) 组件在 Compose Multiplatform 中实现网页视图。这允许你的应用程序在 UI 中显示并与网页内容交互。通过使用 Compose Multiplatform 的 `Modifier.size()` 或 `Modifier.fillMaxSize()` 函数来设置组件大小：

```kotlin
UIKitView(
    factory = {
        WKWebView().apply {
            loadRequest(NSURLRequest(URL = NSURL(string = "https://www.jetbrains.com")))
        }
    },
    modifier = Modifier.size(300.dp)
)
```
现在，让我们来看一个高级示例。此代码配置了网页视图的导航委托，并允许 Kotlin 和 JavaScript 之间进行通信：

```kotlin
@Composable
fun WebViewWithDelegate(
    modifier: Modifier = Modifier,
    initialUrl: String = "https://www.jetbrains.com",
    onNavigationChange: (String) -> Unit = {}
) {
    // Creates a delegate to listen for navigation events
    val delegate = remember {
        object : NSObject(), WKNavigationDelegateProtocol {
            override fun webView(
                webView: WKWebView,
                didFinishNavigation: WKNavigation?
            ) {
                // Updates the current URL after navigation is complete
                onNavigationChange(webView.URL?.absoluteString ?: "")
            }
        }
    }
    UIKitView(
        modifier = modifier,
        factory = {
            // Instantiates a WKWebView and sets its delegate
            val webView = WKWebView().apply {
                navigationDelegate = delegate
                loadRequest(NSURLRequest(uRL = NSURL(string = initialUrl)))
            }
            webView
        },
        update = { webView ->
            // Reloads the web page if the URL changes
            if (webView.URL?.absoluteString != initialUrl) {
                webView.loadRequest(NSURLRequest(uRL = NSURL(string = initialUrl)))
            }
        }
    )
}
```

`WebViewWithDelegate` 可组合函数执行以下任务：

*   创建一个实现了 `WKNavigationDelegateProtocol` 接口的稳定委托对象。该对象使用 Compose 的 `remember` 在重组之间被记住。
*   实例化一个 `WKWebView`，使用 `UIKitView` 嵌入它，并通过赋值记住的委托来配置它。
*   加载由 `initialUrl` 参数提供的初始网页。
*   通过委托观察导航变化，并通过 `onNavigationChange` 回调传递当前 URL。
*   使用 `update` 参数观察请求的 URL 的变化，并相应地重新加载网页。

## 接下来

你还可以探索 Compose Multiplatform [与 SwiftUI framework 集成](compose-swiftui-integration.md)的方式。