[//]: # (title: UIKitフレームワークとの連携)

<show-structure depth="3"/>

Compose Multiplatformは、[UIKit](https://developer.apple.com/documentation/uikit)フレームワークと相互運用が可能です。
Compose MultiplatformをUIKitアプリケーション内に組み込むことも、ネイティブのUIKitコンポーネントをCompose
Multiplatform内に組み込むこともできます。このページでは、UIKitアプリケーション内でCompose Multiplatformを使用する例と、
Compose Multiplatform UI内でUIKitコンポーネントを組み込む例の両方を紹介します。

> SwiftUIの相互運用性については、[](compose-swiftui-integration.md)の記事を参照してください。
>
{style="tip"}

## UIKitアプリケーション内でCompose Multiplatformを使用する

UIKitアプリケーション内でCompose Multiplatformを使用するには、Compose Multiplatformのコードを任意の
[コンテナビューコントローラ](https://developer.apple.com/documentation/uikit/view_controllers)に追加します。
この例では、`UITabBarController`クラス内でCompose Multiplatformを使用しています。

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

このコードを使用すると、アプリケーションは次のようになります。

![UIKit](uikit.png){width=300}

このコードの詳細は、[サンプルプロジェクト](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-compose-in-uikit)で確認できます。

## Compose Multiplatform内でUIKitを使用する

Compose Multiplatform内でUIKit要素を使用するには、使用したいUIKit要素をCompose Multiplatformの
[UIKitView](https://github.com/JetBrains/compose-multiplatform-core/blob/47c012bfe2d4570fb08432253298b8e2b6e38ade/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/interop/UIKitView.uikit.kt)に追加します。
このコードは純粋にKotlinで記述することも、Swiftを使用することもできます。

### マップビュー

Compose Multiplatformでマップビューを実装するには、UIKitの[`MKMapView`](https://developer.apple.com/documentation/mapkit/mkmapview)
コンポーネントを使用します。コンポーネントのサイズは、Compose Multiplatformの`Modifier.size()`関数または
`Modifier.fillMaxSize()`関数を使用して設定します。

```kotlin
UIKitView(
    factory = { MKMapView() },
    modifier = Modifier.size(300.dp),
)
```

このコードを使用すると、アプリケーションは次のようになります。

![MapView](mapview.png){width=300}

次に、より高度な例を見てみましょう。このコードは、UIKitの[`UITextField`](https://developer.apple.com/documentation/uikit/uitextfield/)をCompose Multiplatformでラップしています。

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

*   `factory`パラメータには、`UITextField`への変更を検出するための`editingChanged()`関数と`textField.addTarget()`リスナーが含まれています。
*   `editingChanged()`関数には、Objective-Cコードと相互運用できるように`@ObjCAction`アノテーションが付けられています。
*   `addTarget()`関数の`action`パラメータは、`editingChanged()`関数の名前を渡し、`UIControlEventEditingChanged`イベントに応答してそれをトリガーします。
*   `UIKitView()`の`update`パラメータは、監視可能なメッセージの状態がその値を変更したときに呼び出されます。
*   この関数は`UITextField`の`text`属性を更新し、ユーザーが更新された値を確認できるようにします。

この例のコードは、当社の[サンプルプロジェクト](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-uikit-in-compose)で確認できます。

### カメラビュー

Compose Multiplatformでカメラビューを実装するには、UIKitの[`AVCaptureSession`](https://developer.apple.com/documentation/avfoundation/avcapturesession)
および[`AVCaptureVideoPreviewLayer`](https://developer.apple.com/documentation/avfoundation/avcapturevideopreviewlayer)コンポーネントを使用します。

これにより、アプリケーションはデバイスのカメラにアクセスし、ライブプレビューを表示することができます。

以下に、基本的なカメラビューを実装する方法の例を示します。

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

次に、より高度な例を見てみましょう。このコードは、写真をキャプチャし、GPSメタデータを添付し、ネイティブの`UIView`を使用してライブプレビューを表示します。

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

`RealDeviceCamera`コンポーザブルは、次のタスクを実行します。

*   `AVCaptureSession`と`AVCaptureVideoPreviewLayer`を使用してネイティブカメラのプレビューを設定します。
*   カスタム`UIView`サブクラスをホストする`UIKitView`を作成し、レイアウトの更新を管理してプレビューレイヤーを組み込みます。
*   `AVCapturePhotoOutput`を初期化し、写真のキャプチャを処理するためのデリゲートを設定します。
*   `CLLocationManager` (`locationManager`を介して) を使用して、キャプチャ時のGPS座標を取得します。
*   キャプチャされた画像を`UIImage`に変換し、`PlatformStorableImage`としてラップし、`onCapture`を介して名前、説明、GPS位置などのメタデータを提供します。
*   キャプチャをトリガーするための円形のコンポーザブルボタンを表示します。
*   前面カメラを使用する際、自然な自撮り動作に合わせるためにミラーリング設定を適用します。
*   アニメーションを回避するために、`CATransaction`を使用して`layoutSubviews()`でプレビューレイアウトを動的に更新します。

> 実機でテストするには、アプリの`Info.plist`ファイルに`NSCameraUsageDescription`キーを追加する必要があります。
> これがないと、アプリは実行時にクラッシュします。
>
{style="note"}

この例の完全なコードは、[ImageViewerサンプルプロジェクト](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)で確認できます。

### Webビュー

Compose MultiplatformでWebビューを実装するには、UIKitの[`WKWebView`](https://developer.apple.com/documentation/webkit/wkwebview)
コンポーネントを使用します。これにより、アプリケーションはUI内でWebコンテンツを表示し、操作することができます。
コンポーネントのサイズは、Compose Multiplatformの`Modifier.size()`関数または`Modifier.fillMaxSize()`関数を使用して設定します。

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
次に、より高度な例を見てみましょう。このコードは、ナビゲーションデリゲートを使用してWebビューを設定し、KotlinとJavaScript間の通信を可能にします。

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

`WebViewWithDelegate`コンポーザブルは、次のタスクを実行します。

*   `WKNavigationDelegateProtocol`インターフェースを実装する安定したデリゲートオブジェクトを作成します。
*   このオブジェクトは、Composeの`remember`を使用してリコンポジション間で記憶されます。
*   `WKWebView`をインスタンス化し、`UIKitView`を使用して組み込み、記憶されたデリゲートを割り当てて設定します。
*   `initialUrl`パラメータによって提供される初期Webページをロードします。
*   デリゲートを介してナビゲーションの変更を監視し、`onNavigationChange`コールバックを通じて現在のURLを渡します。
*   `update`パラメータを使用して、要求されたURLの変更を監視し、それに応じてWebページをリロードします。

## 次のステップ

Compose Multiplatformが[SwiftUIフレームワークとどのように統合できるか](compose-swiftui-integration.md)も確認できます。