[//]: # (title: SwiftUI 프레임워크와의 통합)

<show-structure depth="3"/>

Compose Multiplatform은 [SwiftUI](https://developer.apple.com/xcode/swiftui/) 프레임워크와 상호 운용 가능합니다.
SwiftUI 애플리케이션 내에 Compose Multiplatform을 내장할 수 있으며, 네이티브 SwiftUI 컴포넌트를
Compose Multiplatform UI 내에 임베드할 수도 있습니다. 이 페이지에서는 SwiftUI 내에서 Compose Multiplatform을 사용하는 예시와
Compose Multiplatform 앱 내에 SwiftUI를 임베드하는 예시를 모두 제공합니다.

> UIKit 상호 운용성에 대해 알아보려면 [](compose-uikit-integration.md) 문서를 참조하세요.
>
{style="tip"}

## SwiftUI 애플리케이션 내에서 Compose Multiplatform 사용하기

SwiftUI 애플리케이션 내에서 Compose Multiplatform을 사용하려면, UIKit의 [`UIViewController`](https://developer.apple.com/documentation/uikit/uiviewcontroller/)를 반환하며
Compose Multiplatform 코드를 포함하는 `MainViewController()` Kotlin 함수를 생성하세요.

```kotlin
fun MainViewController(): UIViewController =
    ComposeUIViewController {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("This is Compose code", fontSize = 20.sp)
        }
    }
```

[`ComposeUIViewController()`](https://github.com/JetBrains/compose-multiplatform-core/blob/5b487914cc20df24187f9ddf54534dfec30f6752/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/window/ComposeWindow.uikit.kt)는 `content` 인수로 컴포저블 함수를 받는 Compose Multiplatform 라이브러리 함수입니다.
이 방식으로 전달된 함수는 다른 컴포저블 함수(예: `Text()`)를 호출할 수 있습니다.

> 컴포저블 함수는 `@Composable` 어노테이션을 가진 함수입니다.
>
{style="tip"}

다음으로, SwiftUI에서 Compose Multiplatform을 나타내는 구조가 필요합니다.
`UIViewController` 인스턴스를 SwiftUI 뷰로 변환하는 다음 구조를 생성하세요.

```swift
struct ComposeViewController: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> UIViewController {
        return Main_iosKt.MainViewController()
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
    }
}
```

이제 `ComposeView` 구조를 다른 SwiftUI 코드에서 사용할 수 있습니다.

`Main_iosKt.MainViewController`는 생성된
이름입니다. Swift에서 Kotlin 코드에 접근하는 방법에 대한 자세한 내용은 [Swift/Objective-C와의 상호 운용](https://kotlinlang.org/docs/native-objc-interop.html#top-level-functions-and-properties)
페이지에서 확인할 수 있습니다.

최종적으로 애플리케이션은 다음과 같이 보여야 합니다.

![ComposeView](compose-view.png){width=300}

이 `ComposeView`를 어떤 SwiftUI 뷰 계층에서든 사용할 수 있으며 SwiftUI 코드 내에서 크기를 제어할 수 있습니다.

기존 애플리케이션에 Compose Multiplatform을 내장하려는 경우, SwiftUI가 사용되는 모든 곳에서 `ComposeView` 구조를 사용하세요.
예시는 [샘플 프로젝트](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-compose-in-swiftui)를 참조하세요.

## Compose Multiplatform 내에서 SwiftUI 사용하기

Compose Multiplatform 내에서 SwiftUI를 사용하려면, Swift 코드를 중간 [`UIViewController`](https://developer.apple.com/documentation/uikit/uiviewcontroller/)에 추가하세요.
현재 Kotlin에서 SwiftUI 구조를 직접 작성할 수 없습니다. 대신 Swift로 작성하여 Kotlin 함수에 전달해야 합니다.

시작하려면, `ComposeUIViewController` 컴포넌트를 생성하기 위해 진입점 함수에 인수를 추가하세요.

```kotlin
@OptIn(ExperimentalForeignApi::class)
fun ComposeEntryPointWithUIViewController(
    createUIViewController: () -> UIViewController
): UIViewController =
    ComposeUIViewController {
        Column(
            Modifier
                .fillMaxSize()
                .windowInsetsPadding(WindowInsets.systemBars),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("How to use SwiftUI inside Compose Multiplatform")
            UIKitViewController(
                factory = createUIViewController,
                modifier = Modifier.size(300.dp).border(2.dp, Color.Blue),
            )
        }
    }
```

Swift 코드에서 `createUIViewController`를 진입점 함수에 전달하세요.
`UIHostingController` 인스턴스를 사용하여 SwiftUI 뷰를 래핑할 수 있습니다.

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: { () -> UIViewController in
    let swiftUIView = VStack {
        Text("SwiftUI in Compose Multiplatform")
    }
    return UIHostingController(rootView: swiftUIView)
})
```

최종적으로 애플리케이션은 다음과 같이 보여야 합니다.

![UIView](uiview.png){width=300}

이 예시의 코드는 [샘플 프로젝트](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-swiftui-in-compose)에서 확인할 수 있습니다.

### 지도 뷰

Compose Multiplatform에서 SwiftUI의 [`Map`](https://developer.apple.com/documentation/mapkit/map) 컴포넌트를 사용하여 지도 뷰를 구현할 수 있습니다. 이를 통해 애플리케이션은 완전히 상호 작용 가능한 SwiftUI 지도를 표시할 수 있습니다.

동일한 [Kotlin 진입점 함수](#use-swiftui-inside-compose-multiplatform)의 경우, Swift에서는 `UIHostingController`를 사용하여 `Map` 뷰를 래핑하는 `UIViewController`를 전달하세요.

```swift
import SwiftUI
import MapKit

Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: {
    let region = Binding.constant(
        MKCoordinateRegion(
            center: CLLocationCoordinate2D(latitude: 37.7749, longitude: -122.4194),
            span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05)
        )
    )

    let mapView = Map(coordinateRegion: region)
    return UIHostingController(rootView: mapView)
})
```

이제 고급 예시를 살펴보겠습니다. 이 코드는 SwiftUI 지도에 사용자 정의 어노테이션을 추가하고 Swift에서 뷰 상태를 업데이트할 수 있도록 합니다.

```swift
import SwiftUI
import MapKit

struct AnnotatedMapView: View {
    // Manages map region state
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 51.5074, longitude: -0.1278),
        span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1)
    )
    // Displays a map with a custom annotation
    var body: some View {
        Map(coordinateRegion: $region, annotationItems: [Landmark.example]) { landmark in
            MapMarker(coordinate: landmark.coordinate, tint: .blue)
        }
    }
}

struct Landmark: Identifiable {
    let id = UUID()
    let name: String
    let coordinate: CLLocationCoordinate2D

    static let example = Landmark(
        name: "Big Ben",
        coordinate: CLLocationCoordinate2D(latitude: 51.5007, longitude: -0.1246)
    )
}
```

그런 다음 이 어노테이션이 추가된 지도를 `UIHostingController`로 래핑하여 Compose Multiplatform 코드에 전달할 수 있습니다.

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: {
    return UIHostingController(rootView: AnnotatedMapView())
})
```

`AnnotatedMapView`는 다음 작업을 수행합니다.

*   SwiftUI `Map` 뷰를 정의하고 `AnnotatedMapView`라는 사용자 정의 뷰 안에 내장합니다.
*   `@State`와 `MKCoordinateRegion`을 사용하여 지도 위치 지정을 위한 내부 상태를 관리하며, Compose Multiplatform이 상호 작용 가능하고 상태를 인식하는 지도를 표시할 수 있도록 합니다.
*   `Identifiable`을 준수하는 정적 `Landmark` 모델을 사용하여 지도에 `MapMarker`를 표시합니다. 이는 SwiftUI에서 어노테이션에 필요합니다.
*   `annotationItems`를 사용하여 지도에 사용자 정의 마커를 선언적으로 배치합니다.
*   SwiftUI 컴포넌트를 `UIHostingController` 안에 래핑하며, 이는 `UIViewController`로 Compose Multiplatform에 전달됩니다.

### 카메라 뷰

Compose Multiplatform에서 SwiftUI와 UIKit의 [`UIImagePickerController`](https://developer.apple.com/documentation/uikit/uiimagepickercontroller)를 SwiftUI 호환 컴포넌트로 래핑하여 카메라 뷰를 구현할 수 있습니다. 이를 통해 애플리케이션은 시스템 카메라를 실행하고 사진을 캡처할 수 있습니다.

동일한 [Kotlin 진입점 함수](#use-swiftui-inside-compose-multiplatform)의 경우, Swift에서는 `UIImagePickerController`를 사용하여 기본 `CameraView`를 정의하고 `UIHostingController`를 사용하여 임베드하세요.

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: {
    return UIHostingController(rootView: CameraView { image in
        // Handle captured image here
    })
})
```

이를 위해 `CameraView`를 다음과 같이 정의하세요.

```swift
import SwiftUI
import UIKit

struct CameraView: UIViewControllerRepresentable {
    let imageHandler: (UIImage) -> Void
    @Environment(\.presentationMode) private var presentationMode

    init(imageHandler: @escaping (UIImage) -> Void) {
        self.imageHandler = imageHandler
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = .camera
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}

    class Coordinator: NSObject, UINavigationControllerDelegate, UIImagePickerControllerDelegate {
        let parent: CameraView

        init(_ parent: CameraView) {
            self.parent = parent
        }

        func imagePickerController(_ picker: UIImagePickerController,
                                   didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
            if let image = info[.originalImage] as? UIImage {
                parent.imageHandler(image)
            }
            parent.presentationMode.wrappedValue.dismiss()
        }

        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            parent.presentationMode.wrappedValue.dismiss()
        }
    }
}
```

이제 고급 예시를 살펴보겠습니다. 이 코드는 카메라 뷰를 제공하고 캡처된 이미지의 썸네일을 동일한 SwiftUI 뷰에 표시합니다.

```swift
import SwiftUI
import UIKit

struct CameraPreview: View {
    // Controls the camera sheet visibility
    @State private var showCamera = false
    // Stores the captured image
    @State private var capturedImage: UIImage?

    var body: some View {
        VStack {
            if let image = capturedImage {
                // Displays the captured image
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .frame(height: 200)
            } else {
                // Shows placeholder text when no image is captured
                Text("No image captured")
            }

            // Adds a button to open the camera
            Button("Open Camera") {
                showCamera = true
            }
            // Presents CameraView as a modal sheet
            .sheet(isPresented: $showCamera) {
                CameraView { image in
                    capturedImage = image
                }
            }
        }
    }
}
```

`CameraPreview` 뷰는 다음 작업을 수행합니다.

*   사용자가 버튼을 탭하면 모달 `.sheet`로 `CameraView`를 표시합니다.
*   `@State` 프로퍼티 래퍼를 사용하여 캡처된 이미지를 저장하고 표시합니다.
*   SwiftUI의 네이티브 `Image` 뷰를 내장하여 사진을 미리 봅니다.
*   이전과 동일한 `UIViewControllerRepresentable` 기반 `CameraView`를 재사용하지만, SwiftUI 상태 시스템에 더 깊이 통합합니다.

> 실제 기기에서 테스트하려면 앱의 `Info.plist` 파일에 `NSCameraUsageDescription` 키를 추가해야 합니다.
> 이 키가 없으면 앱은 런타임에 충돌할 것입니다.
>
{style="note"}

### 웹 뷰

Compose Multiplatform에서 SwiftUI를 사용하여 웹 뷰를 구현할 수 있습니다. UIKit의 [`WKWebView`](https://developer.apple.com/documentation/webkit/wkwebview) 컴포넌트를 `UIViewRepresentable`로 래핑하여. 이를 통해 전체 네이티브 렌더링으로 임베디드 웹 콘텐츠를 표시할 수 있습니다.

동일한 [Kotlin 진입점 함수](#use-swiftui-inside-compose-multiplatform)의 경우, Swift에서는 `UIHostingController`를 사용하여 임베드된 기본 `WebView`를 정의하세요.

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: {
    let url = URL(string: "https://www.jetbrains.com")!
    return UIHostingController(rootView: WebView(url: url))
})
```

이제 고급 예시를 살펴보겠습니다. 이 코드는 웹 뷰에 탐색 추적 및 로딩 상태 표시 기능을 추가합니다.

```swift
import SwiftUI
import UIKit
import WebKit

struct AdvancedWebView: UIViewRepresentable {
    let url: URL
    @Binding var isLoading: Bool
    @Binding var currentURL: String

    // Creates WKWebView with navigation delegate
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        webView.load(URLRequest(url: url))
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    // Creates coordinator to handle web navigation events 
    func makeCoordinator() -> Coordinator {
        Coordinator(isLoading: $isLoading, currentURL: $currentURL)
    }

    class Coordinator: NSObject, WKNavigationDelegate {
        @Binding var isLoading: Bool
        @Binding var currentURL: String

        init(isLoading: Binding<Bool>, currentURL: Binding<String>) {
            _isLoading = isLoading
            _currentURL = currentURL
        }

        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation?) {
            isLoading = true
        }

        // Updates URL and indicates loading has completed
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation?) {
            isLoading = false
            currentURL = webView.url?.absoluteString ?? ""
        }
    }
}
```

SwiftUI 뷰에서 다음과 같이 사용합니다.

```swift
struct WebViewContainer: View {
    // Tracks loading state of web view
    @State private var isLoading = false
    // Tracks current URL displayed
    @State private var currentURL = ""

    var body: some View {
        VStack {
            // Displays loading indicator while loading
            if isLoading {
                ProgressView()
            }
            // Shows current URL
            Text("URL: \(currentURL)")
                .font(.caption)
                .lineLimit(1)
                .truncationMode(.middle)

            // Embeds the advanced web view
            AdvancedWebView(
                url: URL(string: "https://www.jetbrains.com")!,
                isLoading: $isLoading,
                currentURL: $currentURL
            )
        }
    }
}
```

`AdvancedWebView`와 `WebViewContainer`는 다음 작업을 수행합니다.

*   사용자 정의 탐색 델리게이트를 사용하여 `WKWebView`를 생성하여 로딩 진행률과 URL 변경 사항을 추적합니다.
*   SwiftUI의 `@State` 바인딩을 사용하여 탐색 이벤트에 반응하여 UI를 동적으로 업데이트합니다.
*   페이지가 로드되는 동안 `ProgressView` 스피너를 표시합니다.
*   `Text` 컴포넌트를 사용하여 뷰 상단에 현재 URL을 표시합니다.
*   `UIHostingController`를 사용하여 이 컴포넌트를 Compose UI에 통합합니다.

## 다음 단계

Compose Multiplatform이 [UIKit 프레임워크와 통합](compose-uikit-integration.md)될 수 있는 방법도 탐색할 수 있습니다.