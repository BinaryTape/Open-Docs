[//]: # (title: SwiftUIフレームワークとの統合)

<show-structure depth="3"/>

Compose Multiplatform は [SwiftUI](https://developer.apple.com/xcode/swiftui/) フレームワークと相互運用可能です。
SwiftUI アプリケーション内に Compose Multiplatform を組み込むことも、Compose Multiplatform UI 内にネイティブの SwiftUI コンポーネントを組み込むこともできます。このページでは、SwiftUI 内で Compose Multiplatform を使用する例と、Compose Multiplatform アプリ内に SwiftUI を組み込む例の両方について説明します。

> UIKit の相互運用性については、[](compose-uikit-integration.md) の記事を参照してください。
>
{style="tip"}

## SwiftUI アプリケーション内で Compose Multiplatform を使用する

SwiftUI アプリケーション内で Compose Multiplatform を使用するには、UIKit の [`UIViewController`](https://developer.apple.com/documentation/uikit/uiviewcontroller/) を返し、Compose Multiplatform コードを含む Kotlin 関数 `MainViewController()` を作成します。

```kotlin
fun MainViewController(): UIViewController =
    ComposeUIViewController {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("This is Compose code", fontSize = 20.sp)
        }
    }
```

[`ComposeUIViewController()`](https://github.com/JetBrains/compose-multiplatform-core/blob/5b487914cc20df24187f9ddf54534dfec30f6752/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/window/ComposeWindow.uikit.kt) は、コンポーザブル関数 (composable function) を `content` 引数として受け入れる Compose Multiplatform ライブラリ関数です。
このように渡された関数は、他のコンポーザブル関数（例えば `Text()`）を呼び出すことができます。

> コンポーザブル関数は、`@Composable` アノテーションを持つ関数です。
>
{style="tip"}

次に、SwiftUI で Compose Multiplatform を表現する構造体が必要です。
`UIViewController` インスタンスを SwiftUI ビューに変換する以下の構造体を作成します。

```swift
struct ComposeViewController: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> UIViewController {
        return Main_iosKt.MainViewController()
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
    }
}
```

これで、他の SwiftUI コードで `ComposeView` 構造体を使用できます。

`Main_iosKt.MainViewController` は生成された名前です。Swift から Kotlin コードにアクセスする方法については、[Swift/Objective-C との相互運用](https://kotlinlang.org/docs/native-objc-interop.html#top-level-functions-and-properties) のページで詳しく学ぶことができます。

最終的に、アプリケーションは次のようになります。

![ComposeView](compose-view.png){width=300}

この `ComposeView` は、あらゆる SwiftUI ビュー階層で使用でき、SwiftUI コード内からサイズを制御できます。

既存のアプリケーションに Compose Multiplatform を組み込みたい場合は、SwiftUI が使用されている箇所で `ComposeView` 構造体を使用してください。
例については、[サンプルプロジェクト](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-compose-in-swiftui) を参照してください。

## Compose Multiplatform 内で SwiftUI を使用する

Compose Multiplatform 内で SwiftUI を使用するには、Swift コードを中間的な [`UIViewController`](https://developer.apple.com/documentation/uikit/uiviewcontroller/) に追加します。
現在、SwiftUI 構造体を Kotlin で直接記述することはできません。代わりに、Swift で記述し、Kotlin 関数に渡す必要があります。

まず、`ComposeUIViewController` コンポーネントを作成するための引数をエントリポイント関数に追加します。

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

Swift コードでは、`createUIViewController` をエントリポイント関数に渡します。
`UIHostingController` インスタンスを使用して SwiftUI ビューをラップできます。

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: { () -> UIViewController in
    let swiftUIView = VStack {
        Text("SwiftUI in Compose Multiplatform")
    }
    return UIHostingController(rootView: swiftUIView)
})
```

最終的に、アプリケーションは次のようになります。

![UIView](uiview.png){width=300}

この例のコードは、[サンプルプロジェクト](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-swiftui-in-compose) で確認できます。

### マップビュー

Compose Multiplatform では、SwiftUI の [`Map`](https://developer.apple.com/documentation/mapkit/map) コンポーネントを使用してマップビューを実装できます。
これにより、アプリケーションは完全にインタラクティブな SwiftUI マップを表示できます。

同じ [Kotlin エントリポイント関数](#use-swiftui-inside-compose-multiplatform)に対して、Swift では `UIHostingController` を使用して `Map` ビューをラップする `UIViewController` を渡します。

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

次に、高度な例を見てみましょう。このコードは、SwiftUI マップにカスタムアノテーションを追加し、Swift からビューの状態を更新できるようにします。

```swift
import SwiftUI
import MapKit

struct AnnotatedMapView: View {
    // Manages map region state
    // マップの領域状態を管理します
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 51.5074, longitude: -0.1278),
        span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1)
    )
    // Displays a map with a custom annotation
    // カスタムアノテーション付きのマップを表示します
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

このアノテーション付きマップを `UIHostingController` でラップし、Compose Multiplatform コードに渡すことができます。

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: {
    return UIHostingController(rootView: AnnotatedMapView())
})
```

`AnnotatedMapView` は以下のタスクを実行します。

*   SwiftUI の `Map` ビューを定義し、それを `AnnotatedMapView` というカスタムビュー内に埋め込みます。
*   `@State` と `MKCoordinateRegion` を使用してマップの位置決めの内部状態を管理し、Compose Multiplatform がインタラクティブな、状態を認識するマップを表示できるようにします。
*   `Identifiable` に準拠する静的な `Landmark` モデルを使用して、マップ上に `MapMarker` を表示します。これは SwiftUI のアノテーションに必要です。
*   `annotationItems` を使用して、カスタムマーカーをマップ上に宣言的に配置します。
*   SwiftUI コンポーネントを `UIHostingController` 内にラップし、それを `UIViewController` として Compose Multiplatform に渡します。

### カメラビュー

Compose Multiplatform では、SwiftUI および UIKit の [`UIImagePickerController`](https://developer.apple.com/documentation/uikit/uiimagepickercontroller) を SwiftUI 互換コンポーネントでラップして、カメラビューを実装できます。
これにより、アプリケーションはシステムカメラを起動して写真をキャプチャできます。

同じ [Kotlin エントリポイント関数](#use-swiftui-inside-compose-multiplatform)に対して、Swift では `UIImagePickerController` を使用して基本的な `CameraView` を定義し、`UIHostingController` を使用してそれを埋め込みます。

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: {
    return UIHostingController(rootView: CameraView { image in
        // Handle captured image here
        // キャプチャした画像をここで処理
    })
})
```

これを機能させるには、`CameraView` を次のように定義します。

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

次に、高度な例を見てみましょう。このコードはカメラビューを表示し、キャプチャされた画像のサムネイルを同じ SwiftUI ビュー内に表示します。

```swift
import SwiftUI
import UIKit

struct CameraPreview: View {
    // Controls the camera sheet visibility
    // カメラシートの表示/非表示を制御
    @State private var showCamera = false
    // Stores the captured image
    // キャプチャした画像を保存
    @State private var capturedImage: UIImage?

    var body: some View {
        VStack {
            if let image = capturedImage {
                // Displays the captured image
                // キャプチャした画像を表示
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .frame(height: 200)
            } else {
                // Shows placeholder text when no image is captured
                // 画像がキャプチャされていない場合にプレースホルダーテキストを表示
                Text("No image captured")
            }

            // Adds a button to open the camera
            // カメラを開くボタンを追加
            Button("Open Camera") {
                showCamera = true
            }
            // Presents CameraView as a modal sheet
            // CameraViewをモーダルシートとして表示
            .sheet(isPresented: $showCamera) {
                CameraView { image in
                    capturedImage = image
                }
            }
        }
    }
}
```

`CameraPreview` ビューは以下のタスクを実行します。

*   ユーザーがボタンをタップすると、モーダル `.sheet` で `CameraView` を表示します。
*   `@State` プロパティラッパーを使用して、キャプチャされた画像を保存および表示します。
*   SwiftUI のネイティブ `Image` ビューを埋め込んで、写真をプレビューします。
*   以前と同じ `UIViewControllerRepresentable` ベースの `CameraView` を再利用しますが、SwiftUI の状態システムにさらに深く統合します。

> 実機でテストするには、アプリの `Info.plist` ファイルに `NSCameraUsageDescription` キーを追加する必要があります。これがないと、アプリは実行時にクラッシュします。
>
{style="note"}

### ウェブビュー

Compose Multiplatform では、UIKit の [`WKWebView`](https://developer.apple.com/documentation/webkit/wkwebview) コンポーネントを `UIViewRepresentable` でラップすることにより、SwiftUI を使用してウェブビューを実装できます。
これにより、完全にネイティブなレンダリングで埋め込みウェブコンテンツを表示できます。

同じ [Kotlin エントリポイント関数](#use-swiftui-inside-compose-multiplatform)に対して、Swift では `UIHostingController` を使用して埋め込まれた基本的な `WebView` を定義します。

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: {
    let url = URL(string: "https://www.jetbrains.com")!
    return UIHostingController(rootView: WebView(url: url))
})
```

次に、高度な例を見てみましょう。このコードは、ウェブビューにナビゲーション追跡と読み込み状態の表示を追加します。

```swift
import SwiftUI
import UIKit
import WebKit

struct AdvancedWebView: UIViewRepresentable {
    let url: URL
    @Binding var isLoading: Bool
    @Binding var currentURL: String

    // Creates WKWebView with navigation delegate
    // ナビゲーションデリゲートを使用してWKWebViewを作成
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        webView.load(URLRequest(url: url))
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    // Creates coordinator to handle web navigation events
    // ウェブナビゲーションイベントを処理するコーディネーターを作成
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
        // URLを更新し、読み込みが完了したことを示す
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation?) {
            isLoading = false
            currentURL = webView.url?.absoluteString ?? ""
        }
    }
}
```

SwiftUI ビューで次のように使用します。

```swift
struct WebViewContainer: View {
    // Tracks loading state of web view
    // ウェブビューの読み込み状態を追跡
    @State private var isLoading = false
    // Tracks current URL displayed
    // 表示されている現在のURLを追跡
    @State private var currentURL = ""

    var body: some View {
        VStack {
            // Displays loading indicator while loading
            // 読み込み中に読み込みインジケーターを表示
            if isLoading {
                ProgressView()
            }
            // Shows current URL
            // 現在のURLを表示
            Text("URL: \(currentURL)")
                .font(.caption)
                .lineLimit(1)
                .truncationMode(.middle)

            // Embeds the advanced web view
            // 高度なウェブビューを埋め込む
            AdvancedWebView(
                url: URL(string: "https://www.jetbrains.com")!,
                isLoading: $isLoading,
                currentURL: $currentURL
            )
        }
    }
}
```

`AdvancedWebView` と `WebViewContainer` は以下のタスクを実行します。

*   カスタムナビゲーションデリゲートを持つ `WKWebView` を作成し、読み込みの進行状況と URL の変更を追跡します。
*   SwiftUI の `@State` バインディングを使用して、ナビゲーションイベントに応じて UI を動的に更新します。
*   ページの読み込み中に `ProgressView` スピナーを表示します。
*   `Text` コンポーネントを使用して、ビューの上部に現在の URL を表示します。
*   `UIHostingController` を使用して、このコンポーネントを Compose UI に統合します。

## 次のステップ

Compose Multiplatform が [UIKit フレームワークと統合される](compose-uikit-integration.md) 方法についても詳しく学ぶことができます。