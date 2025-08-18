[//]: # (title: 与 UIKit framework 的集成)

<show-structure depth="3"/>

Compose Multiplatform 可与 [UIKit](https://developer.apple.com/documentation/uikit) framework 互操作。你可以在 UIKit 应用程序中嵌入 Compose Multiplatform，也可以在 Compose Multiplatform 中嵌入原生的 UIKit 组件。本页面提供了在 UIKit 应用程序内部使用 Compose Multiplatform 以及在 Compose Multiplatform UI 中嵌入 UIKit 组件的示例。

> 要了解 SwiftUI 互操作性，请参见 [与 SwiftUI framework 的集成](compose-swiftui-integration.md) 文章。
>
{style="tip"}

## 在 UIKit 应用程序中使用 Compose Multiplatform

要在 UIKit 应用程序中使用 Compose Multiplatform，请将你的 Compose Multiplatform 代码添加到任何 [容器视图控制器](https://developer.apple.com/documentation/uikit/view_controllers) 中。此示例在 `UITabBarController` 类中使用 Compose Multiplatform：

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

使用此代码，你的应用程序应该如下所示：

![UIKit](uikit.png){width=300}

在 [示例项目](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-compose-in-uikit) 中查看此代码。

## 在 Compose Multiplatform 中使用 UIKit

要在 Compose Multiplatform 中使用 UIKit 元素，请将你要使用的 UIKit 元素添加到 Compose Multiplatform 的 [UIKitView](https://github.com/JetBrains/compose-multiplatform-core/blob/47c012bfe2d4570fb08432253298b8e2b6e38ade/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/interop/UIKitView.uikit.kt) 中。你可以纯粹使用 Kotlin 编写此代码，亦可使用 Swift。

### 地图视图

你可以使用 UIKit 的 [`MKMapView`](https://developer.apple.com/documentation/mapkit/mkmapview) 组件在 Compose Multiplatform 中实现地图视图。通过使用 Compose Multiplatform 的 `Modifier.size()` 或 `Modifier.fillMaxSize()` 函数来设置组件大小：

```kotlin
UIKitView(
    factory = { MKMapView() },
    modifier = Modifier.size(300.dp),
)
```

使用此代码，你的应用程序应该如下所示：

![MapView](mapview.png){width=300}

现在，我们来看一个高级示例。此代码将 UIKit 的 [`UITextField`](https://developer.apple.com/documentation/uikit/uitextfield/) 封装在 Compose Multiplatform 中：

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

*   `factory` 形参包含 `editingChanged()` 函数和 `textField.addTarget()` 监听器，用于检测 `UITextField` 的任何更改。
*   `editingChanged()` 函数使用 `@ObjCAction` 注解，以便它可以与 Objective-C 代码互操作。
*   `addTarget()` 函数的 `action` 形参传递 `editingChanged()` 函数的名称，作为对 `UIControlEventEditingChanged` 事件的响应而触发它。
*   当可观察消息状态的值发生变化时，`UIKitView()` 的 `update` 形参会被调用。
*   此函数更新 `UITextField` 的 `text` 属性，以便用户看到更新后的值。

在我们的 [示例项目](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-uikit-in-compose) 中查看此示例的代码。

### 相机视图

你可以使用 UIKit 的 [`AVCaptureSession`](https://developer.apple.com/documentation/avfoundation/avcapturesession) 和 [`AVCaptureVideoPreviewLayer`](https://developer.apple.com/documentation/avfoundation/avcapturevideopreviewlayer) 组件在 Compose Multiplatform 中实现相机视图。

这允许你的应用程序访问设备的相机并显示实时预览。

下面是实现基本相机视图的示例：

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

现在，我们来看一个高级示例。此代码捕获照片、附加 GPS 元数据，并使用原生的 `UIView` 显示实时预览：

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

`RealDeviceCamera` 可组合项执行以下任务：

*   使用 `AVCaptureSession` 和 `AVCaptureVideoPreviewLayer` 设置原生相机预览。
*   创建一个 `UIKitView`，它托管一个自定义的 `UIView` 子类，该子类管理布局更新并嵌入预览层。
*   初始化 `AVCapturePhotoOutput` 并配置委托以处理照片捕获。
*   使用 `CLLocationManager`（通过 `locationManager`）在捕获时检索 GPS 坐标。
*   将捕获的图像转换为 `UIImage`，将其封装为 `PlatformStorableImage`，并通过 `onCapture` 提供元数据，例如名称、描述和 GPS 位置。
*   显示一个圆形可组合按钮用于触发捕获。
*   使用前置相机时应用镜像设置，以匹配自然的自拍行为。
*   在 `layoutSubviews()` 中使用 `CATransaction` 动态更新预览布局，以避免动画。

> 要在真机上测试，你需要将 `NSCameraUsageDescription` 键添加到应用的 `Info.plist` 文件中。没有它，应用将在运行时崩溃。
>
{style="note"}

在 [ImageViewer 示例项目](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer) 中查看此示例的完整代码。

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
现在，我们来看一个高级示例。此代码配置了带有导航委托的网页视图，并允许 Kotlin 与 JavaScript 之间进行通信：

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

`WebViewWithDelegate` 可组合项执行以下任务：

*   创建一个实现 `WKNavigationDelegateProtocol` 接口的稳定委托对象。此对象使用 Compose 的 `remember` 在多次重组中被记住。
*   实例化一个 `WKWebView`，使用 `UIKitView` 嵌入它，并为其分配被记住的委托。
*   加载由 `initialUrl` 形参提供的初始网页。
*   通过委托观察导航更改，并通过 `onNavigationChange` 回调传递当前 URL。
*   使用 `update` 形参观察请求的 URL 中的更改，并相应地重新加载网页。

## 下一步

你还可以探索 Compose Multiplatform [与 SwiftUI framework 集成](compose-swiftui-integration.md) 的方式。