[//]: # (title: UIKit 프레임워크와 통합)

<show-structure depth="3"/>

Compose Multiplatform은 [UIKit](https://developer.apple.com/documentation/uikit) 프레임워크와 상호 운용 가능합니다. Compose Multiplatform을 UIKit 애플리케이션 내에 포함할 수 있으며, 네이티브 UIKit 컴포넌트를 Compose Multiplatform 내에 포함할 수도 있습니다. 이 페이지에서는 UIKit 애플리케이션 내에서 Compose Multiplatform을 사용하는 방법과 Compose Multiplatform UI 내에 UIKit 컴포넌트를 포함하는 방법에 대한 예시를 모두 제공합니다.

> SwiftUI 상호 운용성에 대해 알아보려면 [SwiftUI 프레임워크와 통합](compose-swiftui-integration.md) 문서를 참조하세요.
>
{style="tip"}

## UIKit 애플리케이션 내에서 Compose Multiplatform 사용

Compose Multiplatform을 UIKit 애플리케이션 내에서 사용하려면, Compose Multiplatform 코드를 모든 [컨테이너 뷰 컨트롤러](https://developer.apple.com/documentation/uikit/view_controllers)에 추가하세요. 다음 예시는 `UITabBarController` 클래스 내에서 Compose Multiplatform을 사용하는 방법을 보여줍니다:

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

이 코드를 사용하면 애플리케이션은 다음과 같이 보일 것입니다:

![UIKit](uikit.png){width=300}

이 코드는 [샘플 프로젝트](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-compose-in-uikit)에서 살펴보세요.

## Compose Multiplatform 내에서 UIKit 사용

Compose Multiplatform 내에서 UIKit 요소를 사용하려면, 사용하려는 UIKit 요소를 Compose Multiplatform의 [UIKitView](https://github.com/JetBrains/compose-multiplatform-core/blob/47c012bfe2d4570fb08432253298b8e2b6e38ade/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/interop/UIKitView.uikit.kt)에 추가하세요. 이 코드는 순수 Kotlin으로 작성하거나 Swift를 사용할 수도 있습니다.

### 지도 뷰

UIKit의 [`MKMapView`](https://developer.apple.com/documentation/mapkit/mkmapview) 컴포넌트를 사용하여 Compose Multiplatform에서 지도 뷰를 구현할 수 있습니다. Compose Multiplatform의 `Modifier.size()` 또는 `Modifier.fillMaxSize()` 함수를 사용하여 컴포넌트 크기를 설정하세요:

```kotlin
UIKitView(
    factory = { MKMapView() },
    modifier = Modifier.size(300.dp),
)
```

이 코드를 사용하면 애플리케이션은 다음과 같이 보일 것입니다:

![MapView](mapview.png){width=300}

이제 고급 예시를 살펴보겠습니다. 이 코드는 UIKit의 [`UITextField`](https://developer.apple.com/documentation/uikit/uitextfield/)를 Compose Multiplatform으로 래핑합니다:

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

*   `factory` 매개변수는 `editingChanged()` 함수와 `UITextField`의 변경 사항을 감지하는 `textField.addTarget()` 리스너를 포함합니다.
*   `editingChanged()` 함수는 Objective-C 코드와 상호 운용할 수 있도록 `@ObjCAction`으로 주석 처리됩니다.
*   `addTarget()` 함수의 `action` 매개변수는 `editingChanged()` 함수의 이름을 전달하여 `UIControlEventEditingChanged` 이벤트에 대한 응답으로 이를 트리거합니다.
*   `UIKitView()`의 `update` 매개변수는 관찰 가능한 메시지 상태가 그 값을 변경할 때 호출됩니다.
*   이 함수는 `UITextField`의 `text` 속성을 업데이트하여 사용자가 업데이트된 값을 볼 수 있도록 합니다.

이 예제의 코드는 [샘플 프로젝트](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-uikit-in-compose)에서 살펴보세요.

### 카메라 뷰

UIKit의 [`AVCaptureSession`](https://developer.apple.com/documentation/avfoundation/avcapturesession) 및 [`AVCaptureVideoPreviewLayer`](https://developer.apple.com/documentation/avfoundation/avcapturevideopreviewlayer) 컴포넌트를 사용하여 Compose Multiplatform에서 카메라 뷰를 구현할 수 있습니다.

이를 통해 애플리케이션은 장치의 카메라에 접근하고 라이브 미리보기를 표시할 수 있습니다.

기본 카메라 뷰를 구현하는 방법의 예시는 다음과 같습니다:

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

이제 고급 예시를 살펴보겠습니다. 이 코드는 사진을 캡처하고, GPS 메타데이터를 첨부하며, 네이티브 `UIView`를 사용하여 라이브 미리보기를 표시합니다:

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

`RealDeviceCamera` 컴포저블은 다음 작업을 수행합니다:

*   `AVCaptureSession` 및 `AVCaptureVideoPreviewLayer`를 사용하여 네이티브 카메라 미리보기를 설정합니다.
*   레이아웃 업데이트를 관리하고 미리보기 레이어를 포함하는 사용자 정의 `UIView` 서브클래스를 호스팅하는 `UIKitView`를 생성합니다.
*   `AVCapturePhotoOutput`을 초기화하고 사진 캡처를 처리하도록 델리게이트를 구성합니다.
*   `CLLocationManager`(`locationManager`를 통해)를 사용하여 캡처 순간의 GPS 좌표를 검색합니다.
*   캡처된 이미지를 `UIImage`로 변환하고, `PlatformStorableImage`로 래핑하며, `onCapture`를 통해 이름, 설명, GPS 위치와 같은 메타데이터를 제공합니다.
*   캡처를 트리거하기 위한 원형 컴포저블 버튼을 표시합니다.
*   전면 카메라를 사용할 때 자연스러운 셀카 동작과 일치하도록 미러링 설정을 적용합니다.
*   애니메이션을 피하기 위해 `CATransaction`을 사용하여 `layoutSubviews()`에서 미리보기 레이아웃을 동적으로 업데이트합니다.

> 실제 장치에서 테스트하려면 앱의 `Info.plist` 파일에 `NSCameraUsageDescription` 키를 추가해야 합니다. 이 키가 없으면 런타임에 앱이 충돌할 것입니다.
>
{style="note"}

이 예제의 전체 코드는 [ImageViewer 샘플 프로젝트](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)에서 살펴보세요.

### 웹 뷰

UIKit의 [`WKWebView`](https://developer.apple.com/documentation/webkit/wkwebview) 컴포넌트를 사용하여 Compose Multiplatform에서 웹 뷰를 구현할 수 있습니다. 이를 통해 애플리케이션은 UI 내에서 웹 콘텐츠를 표시하고 상호 작용할 수 있습니다. Compose Multiplatform의 `Modifier.size()` 또는 `Modifier.fillMaxSize()` 함수를 사용하여 컴포넌트 크기를 설정하세요:

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
이제 고급 예시를 살펴보겠습니다. 이 코드는 탐색 델리게이트를 사용하여 웹 뷰를 구성하고 Kotlin과 JavaScript 간의 통신을 허용합니다:

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

`WebViewWithDelegate` 컴포저블은 다음 작업을 수행합니다:

*   `WKNavigationDelegateProtocol` 인터페이스를 구현하는 안정적인 델리게이트 객체를 생성합니다. 이 객체는 Compose의 `remember`를 사용하여 리컴포지션 전반에 걸쳐 기억됩니다.
*   `WKWebView`를 인스턴스화하고, `UIKitView`를 사용하여 포함하며, 기억된 델리게이트를 할당하여 구성합니다.
*   `initialUrl` 매개변수에 의해 제공되는 초기 웹 페이지를 로드합니다.
*   델리게이트를 통해 탐색 변경 사항을 관찰하고 `onNavigationChange` 콜백을 통해 현재 URL을 전달합니다.
*   `update` 매개변수를 사용하여 요청된 URL의 변경 사항을 관찰하고 그에 따라 웹 페이지를 다시 로드합니다.

## 다음 단계

Compose Multiplatform이 [SwiftUI 프레임워크와 통합될 수 있는](compose-swiftui-integration.md) 방법도 살펴볼 수 있습니다.