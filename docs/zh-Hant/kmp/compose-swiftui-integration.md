[//]: # (title: 與 SwiftUI 框架的整合)

<show-structure depth="3"/>

Compose Multiplatform 可與 [SwiftUI](https://developer.apple.com/xcode/swiftui/) 框架互通。您可以在 SwiftUI 應用程式中嵌入 Compose Multiplatform，也可以在 Compose Multiplatform UI 中嵌入原生 SwiftUI 元件。本頁提供了在 SwiftUI 中使用 Compose Multiplatform 以及在 Compose Multiplatform 應用程式中嵌入 SwiftUI 的範例。

> 若要了解 UIKit 互通性，請參閱 [](compose-uikit-integration.md) 文章。
>
{style="tip"}

## 在 SwiftUI 應用程式中使用 Compose Multiplatform

若要在 SwiftUI 應用程式中使用 Compose Multiplatform，請建立一個 Kotlin 函式 `MainViewController()`，該函式從 UIKit 回傳 [`UIViewController`](https://developer.apple.com/documentation/uikit/uiviewcontroller/) 並包含 Compose Multiplatform 程式碼：

```kotlin
fun MainViewController(): UIViewController =
    ComposeUIViewController {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("This is Compose code", fontSize = 20.sp)
        }
    }
```

[`ComposeUIViewController()`](https://github.com/JetBrains/compose-multiplatform-core/blob/5b487914cc20df24187f9ddf54534dfec30f6752/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/window/ComposeWindow.uikit.kt) 是一個 Compose Multiplatform 函式庫函式，它接受一個可組合函式作為 `content` 引數。以這種方式傳遞的函式可以呼叫其他可組合函式，例如 `Text()`。

> 可組合函式是具有 `@Composable` 註解的函式。
>
{style="tip"}

接下來，您需要一個在 SwiftUI 中代表 Compose Multiplatform 的結構。建立以下結構，它將 `UIViewController` 實例轉換為 SwiftUI 視圖：

```swift
struct ComposeViewController: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> UIViewController {
        return Main_iosKt.MainViewController()
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
    }
}
```

現在，您可以在其他 SwiftUI 程式碼中使用 `ComposeView` 結構了。

`Main_iosKt.MainViewController` 是一個產生名稱。您可以在[與 Swift/Objective-C 互通](https://kotlinlang.org/docs/native-objc-interop.html#top-level-functions-and-properties)頁面了解更多從 Swift 存取 Kotlin 程式碼的資訊。

最後，您的應用程式應呈現如下：

![ComposeView](compose-view.png){width=300}

您可以在任何 SwiftUI 視圖階層中使用這個 `ComposeView`，並從 SwiftUI 程式碼內部控制其大小。

如果您想將 Compose Multiplatform 嵌入到現有應用程式中，請在任何使用 SwiftUI 的地方使用 `ComposeView` 結構。如需範例，請參閱我們的[範例專案](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-compose-in-swiftui)。

## 在 Compose Multiplatform 中使用 SwiftUI

若要在 Compose Multiplatform 中使用 SwiftUI，請將您的 Swift 程式碼加入一個中間的 [`UIViewController`](https://developer.apple.com/documentation/uikit/uiviewcontroller/)。目前，您無法直接在 Kotlin 中編寫 SwiftUI 結構。相反地，您必須在 Swift 中編寫它們，並將其傳遞給 Kotlin 函式。

首先，為您的進入點函式加入一個引數，以建立 `ComposeUIViewController` 元件：

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

在您的 Swift 程式碼中，將 `createUIViewController` 傳遞給您的進入點函式。您可以使用 `UIHostingController` 實例來包裝 SwiftUI 視圖：

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: { () -> UIViewController in
    let swiftUIView = VStack {
        Text("SwiftUI in Compose Multiplatform")
    }
    return UIHostingController(rootView: swiftUIView)
})
```

最後，您的應用程式應呈現如下：

![UIView](uiview.png){width=300}

探索此範例的程式碼，請參閱[範例專案](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-swiftui-in-compose)。

### 地圖視圖

您可以在 Compose Multiplatform 中使用 SwiftUI 的 [`Map`](https://developer.apple.com/documentation/mapkit/map) 元件來實作地圖視圖。這允許您的應用程式顯示完全互動式的 SwiftUI 地圖。

對於相同的 [Kotlin 進入點函式](#use-swiftui-inside-compose-multiplatform)，在 Swift 中，使用 `UIHostingController` 傳遞包裝 `Map` 視圖的 `UIViewController`：

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

現在，讓我們看看一個進階範例。這段程式碼將自訂註解加入 SwiftUI 地圖，並允許您從 Swift 更新視圖狀態：

```swift
import SwiftUI
import MapKit

struct AnnotatedMapView: View {
    // 管理地圖區域狀態
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 51.5074, longitude: -0.1278),
        span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1)
    )
    // 顯示帶有自訂註解的地圖
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

然後，您可以將這個帶有註解的地圖包裝在 `UIHostingController` 中，並將其傳遞給您的 Compose Multiplatform 程式碼：

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: {
    return UIHostingController(rootView: AnnotatedMapView())
})
```

`AnnotatedMapView` 執行以下任務：

*   定義一個 SwiftUI `Map` 視圖，並將其嵌入名為 `AnnotatedMapView` 的自訂視圖中。
*   使用 `@State` 和 `MKCoordinateRegion` 管理地圖定位的內部狀態，允許 Compose Multiplatform 顯示一個互動式的狀態感知地圖。
*   使用符合 `Identifiable` 的靜態 `Landmark` 模型在地圖上顯示 `MapMarker`，這是 SwiftUI 中註解所需的。
*   使用 `annotationItems` 宣告式地在地圖上放置自訂標記。
*   將 SwiftUI 元件包裝在 `UIHostingController` 內部，然後作為 `UIViewController` 傳遞給 Compose Multiplatform。

### 相機視圖

您可以在 Compose Multiplatform 中使用 SwiftUI 和 UIKit 的 [`UIImagePickerController`](https://developer.apple.com/documentation/uikit/uiimagepickercontroller) 來實作相機視圖，該元件包裝在一個與 SwiftUI 相容的元件中。這允許您的應用程式啟動系統相機並拍攝照片。

對於相同的 [Kotlin 進入點函式](#use-swiftui-inside-compose-multiplatform)，在 Swift 中，使用 `UIImagePickerController` 定義一個基本的 `CameraView`，並使用 `UIHostingController` 將其嵌入：

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: {
    return UIHostingController(rootView: CameraView { image in
        // 在此處理拍攝到的影像
    })
})
```

為了使其運作，將 `CameraView` 定義如下：

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

現在，讓我們看看一個進階範例。這段程式碼呈現一個相機視圖，並在相同的 SwiftUI 視圖中顯示拍攝到的影像縮圖：

```swift
import SwiftUI
import UIKit

struct CameraPreview: View {
    // 控制相機工作表的顯示狀態
    @State private var showCamera = false
    // 儲存拍攝到的影像
    @State private var capturedImage: UIImage?

    var body: some View {
        VStack {
            if let image = capturedImage {
                // 顯示拍攝到的影像
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .frame(height: 200)
            } else {
                // 當沒有拍攝到影像時顯示預留文字
                Text("No image captured")
            }

            // 加入按鈕以開啟相機
            Button("Open Camera") {
                showCamera = true
            }
            // 將 CameraView 作為模態表單呈現
            .sheet(isPresented: $showCamera) {
                CameraView { image in
                    capturedImage = image
                }
            }
        }
    }
}
```

`CameraPreview` 視圖執行以下任務：

*   當使用者點擊按鈕時，在模態 `.sheet` 中呈現 `CameraView`。
*   使用 `@State` 屬性包裝器來儲存和顯示拍攝到的影像。
*   嵌入 SwiftUI 的原生 `Image` 視圖以預覽照片。
*   重用與之前相同的基於 `UIViewControllerRepresentable` 的 `CameraView`，但將其更深入地整合到 SwiftUI 狀態系統中。

> 若要在真實裝置上測試，您需要將 `NSCameraUsageDescription` 鍵加入應用程式的 `Info.plist` 檔案中。沒有它，應用程式將在執行時崩潰。
>
{style="note"}

### 網頁視圖

您可以在 Compose Multiplatform 中使用 SwiftUI 來實作網頁視圖，方法是使用 `UIViewRepresentable` 包裝 UIKit 的 [`WKWebView`](https://developer.apple.com/documentation/webkit/wkwebview) 元件。這允許您顯示具有完整原生渲染的內嵌網頁內容。

對於相同的 [Kotlin 進入點函式](#use-swiftui-inside-compose-multiplatform)，在 Swift 中，定義一個使用 `UIHostingController` 嵌入的基本 `WebView`：

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: {
    let url = URL(string: "https://www.jetbrains.com")!
    return UIHostingController(rootView: WebView(url: url))
})
```

現在，讓我們看看一個進階範例。這段程式碼為網頁視圖加入了導航追蹤和載入狀態顯示：

```swift
import SwiftUI
import UIKit
import WebKit

struct AdvancedWebView: UIViewRepresentable {
    let url: URL
    @Binding var isLoading: Bool
    @Binding var currentURL: String

    // 建立帶有導航委派的 WKWebView
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        webView.load(URLRequest(url: url))
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    // 建立協調器以處理網頁導航事件 
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

        // 更新 URL 並指示載入已完成
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation?) {
            isLoading = false
            currentURL = webView.url?.absoluteString ?? ""
        }
    }
}
```

在 SwiftUI 視圖中如下使用它：

```swift
struct WebViewContainer: View {
    // 追蹤網頁視圖的載入狀態
    @State private var isLoading = false
    // 追蹤當前顯示的 URL
    @State private var currentURL = ""

    var body: some View {
        VStack {
            // 在載入時顯示載入指示器
            if isLoading {
                ProgressView()
            }
            // 顯示當前 URL
            Text("URL: \(currentURL)")
                .font(.caption)
                .lineLimit(1)
                .truncationMode(.middle)

            // 嵌入進階網頁視圖
            AdvancedWebView(
                url: URL(string: "https://www.jetbrains.com")!,
                isLoading: $isLoading,
                currentURL: $currentURL
            )
        }
    }
}
```

`AdvancedWebView` 和 `WebViewContainer` 執行以下任務：

*   建立一個帶有自訂導航委派的 `WKWebView`，以追蹤載入進度和 URL 變更。
*   使用 SwiftUI 的 `@State` 繫結來動態更新 UI 以響應導航事件。
*   在頁面載入時顯示一個 `ProgressView` 旋轉指示器。
*   在視圖頂部使用 `Text` 元件顯示當前 URL。
*   使用 `UIHostingController` 將此元件整合到您的 Compose UI 中。

## 下一步

您還可以探索 Compose Multiplatform 可以[與 UIKit 框架整合](compose-uikit-integration.md)的方式。