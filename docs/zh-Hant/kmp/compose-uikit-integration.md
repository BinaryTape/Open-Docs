[//]: # (title: 與 UIKit 框架整合)

<show-structure depth="3"/>

Compose Multiplatform 可與 [UIKit](https://developer.apple.com/documentation/uikit) 框架互通。您可以在 UIKit 應用程式中嵌入 Compose Multiplatform，也可以在 Compose Multiplatform 中嵌入原生 UIKit 元件。本頁提供在 UIKit 應用程式內使用 Compose Multiplatform，以及在 Compose Multiplatform UI 內嵌入 UIKit 元件的兩種範例。

> 若要了解 SwiftUI 互通性，請參閱 [](compose-swiftui-integration.md) 文章。
>
{style="tip"}

## 在 UIKit 應用程式內使用 Compose Multiplatform

若要在 UIKit 應用程式內使用 Compose Multiplatform，請將您的 Compose Multiplatform 程式碼新增至任何 [container view controller](https://developer.apple.com/documentation/uikit/view_controllers)。本範例在 `UITabBarController` 類別內使用 Compose Multiplatform：

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

使用這段程式碼，您的應用程式應會如下所示：

![UIKit](uikit.png){width=300}

在 [範例專案](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-compose-in-uikit) 中探索這段程式碼。

## 在 Compose Multiplatform 內使用 UIKit

若要在 Compose Multiplatform 內使用 UIKit 元素，請將您想使用的 UIKit 元素新增至 Compose Multiplatform 的一個 [UIKitView](https://github.com/JetBrains/compose-multiplatform-core/blob/47c012bfe2d4570fb08432253298b8e2b6e38ade/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/interop/UIKitView.uikit.kt) 中。您可以純粹以 Kotlin 撰寫這段程式碼，也可以使用 Swift。

### 地圖檢視

您可以使用 UIKit 的 [`MKMapView`](https://developer.apple.com/documentation/mapkit/mkmapview) 元件在 Compose Multiplatform 中實作地圖檢視。透過使用 Compose Multiplatform 的 `Modifier.size()` 或 `Modifier.fillMaxSize()` 函數來設定元件大小：

```kotlin
UIKitView(
    factory = { MKMapView() },
    modifier = Modifier.size(300.dp),
)
```

使用這段程式碼，您的應用程式應會如下所示：

![MapView](mapview.png){width=300}

現在，讓我們看看一個進階範例。這段程式碼將 UIKit 的 [`UITextField`](https://developer.apple.com/documentation/uikit/uitextfield/) 包裝在 Compose Multiplatform 中：

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

* factory 參數包含 `editingChanged()` 函數和 `textField.addTarget()` 監聽器，以偵測對 `UITextField` 的任何變更。
* `editingChanged()` 函數以 `@ObjCAction` 註解，以便其能與 Objective-C 程式碼互通。
* `addTarget()` 函數的 `action` 參數會傳遞 `editingChanged()` 函數的名稱，以響應 `UIControlEventEditingChanged` 事件觸發該函數。
* 當可觀察的訊息狀態變更其值時，會呼叫 `UIKitView()` 的 `update` 參數。
* 該函數會更新 `UITextField` 的 `text` 屬性，以便使用者看到更新後的值。

在我們的 [範例專案](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-uikit-in-compose) 中探索此範例的程式碼。

### 相機檢視

您可以使用 UIKit 的 [`AVCaptureSession`](https://developer.apple.com/documentation/avfoundation/avcapturesession) 和 [`AVCaptureVideoPreviewLayer`](https://developer.apple.com/documentation/avfoundation/avcapturevideopreviewlayer) 元件在 Compose Multiplatform 中實作相機檢視。

這允許您的應用程式存取裝置的相機並顯示即時預覽。

以下是實作基本相機檢視的範例：

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

現在，讓我們看看一個進階範例。這段程式碼會捕捉照片、附加 GPS 中繼資料，並使用原生 `UIView` 顯示即時預覽：

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

`RealDeviceCamera` composable 執行以下任務：

* 使用 `AVCaptureSession` 和 `AVCaptureVideoPreviewLayer` 設定原生相機預覽。
* 建立一個 `UIKitView`，用於託管自訂的 `UIView` 子類別，該子類別管理版面配置更新並嵌入預覽圖層。
* 初始化 `AVCapturePhotoOutput` 並設定委派以處理照片捕捉。
* 使用 `CLLocationManager` (透過 `locationManager`) 擷取捕捉時的 GPS 座標。
* 將捕捉到的影像轉換為 `UIImage`，將其包裝為 `PlatformStorableImage`，並透過 `onCapture` 提供諸如名稱、描述和 GPS 位置等中繼資料。
* 顯示一個用於觸發捕捉的圓形可組合按鈕。
* 使用前置相機時套用鏡像設定，以符合自然自拍行為。
* 使用 `CATransaction` 在 `layoutSubviews()` 中動態更新預覽版面配置，以避免動畫。

> 若要在實際裝置上測試，您需要將 `NSCameraUsageDescription` 鍵新增至您的應用程式的 `Info.plist` 檔案中。否則，應用程式會在執行時崩潰。
>
{style="note"}

在 [ImageViewer 範例專案](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer) 中探索此範例的完整程式碼。

### 網頁檢視

您可以使用 UIKit 的 [`WKWebView`](https://developer.apple.com/documentation/webkit/wkwebview) 元件在 Compose Multiplatform 中實作網頁檢視。這允許您的應用程式在 UI 中顯示網頁內容並與之互動。透過使用 Compose Multiplatform 的 `Modifier.size()` 或 `Modifier.fillMaxSize()` 函數來設定元件大小：

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
現在，讓我們看看一個進階範例。這段程式碼使用導覽委派設定網頁檢視，並允許 Kotlin 和 JavaScript 之間通訊：

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

`WebViewWithDelegate` composable 執行以下任務：

* 建立一個實作 `WKNavigationDelegateProtocol` 介面的穩定委派物件。此物件使用 Compose 的 `remember` 在重新組合之間被記住。
* 實例化一個 `WKWebView`，使用 `UIKitView` 嵌入它，並指派已記住的委派來設定它。
* 載入由 `initialUrl` 參數提供的初始網頁。
* 透過委派觀察導覽變更，並透過 `onNavigationChange` 回呼傳遞目前的 URL。
* 使用 `update` 參數觀察請求 URL 中的變更，並相應地重新載入網頁。

## 接下來

您還可以探索 Compose Multiplatform 可以與 [SwiftUI 框架整合](compose-swiftui-integration.md) 的方式。