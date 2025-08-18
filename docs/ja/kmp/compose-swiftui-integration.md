[//]: # (title: SwiftUIフレームワークとの統合)

<show-structure depth="3"/>

Compose Multiplatformは、[SwiftUI](https://developer.apple.com/xcode/swiftui/)フレームワークと相互運用可能です。
Compose MultiplatformをSwiftUIアプリケーション内に組み込むことも、ネイティブのSwiftUIコンポーネントを
Compose Multiplatform UI内に組み込むこともできます。このページでは、Compose MultiplatformをSwiftUI内で使用する例と、
SwiftUIをCompose Multiplatformアプリ内に組み込む例の両方について説明します。

> UIKitの相互運用性について学ぶには、「[UIKitフレームワークとの統合](compose-uikit-integration.md)」の記事を参照してください。
>
{style="tip"}

## SwiftUIアプリケーション内でCompose Multiplatformを使用する

SwiftUIアプリケーション内でCompose Multiplatformを使用するには、UIKitの[`UIViewController`](https://developer.apple.com/documentation/uikit/uiviewcontroller/)を返し、
Compose Multiplatformコードを含むKotlin関数`MainViewController()`を作成します。

```kotlin
fun MainViewController(): UIViewController =
    ComposeUIViewController {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("This is Compose code", fontSize = 20.sp)
        }
    }
```

[`ComposeUIViewController()`](https://github.com/JetBrains/compose-multiplatform-core/blob/5b487914cc20df24187f9ddf54534dfec30f6752/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/window/ComposeWindow.uikit.kt)は、`content`引数としてコンポーザブル関数を受け入れるCompose Multiplatformライブラリ関数です。
この方法で渡された関数は、他のコンポーザブル関数（例: `Text()`）を呼び出すことができます。

> コンポーザブル関数は、`@Composable`アノテーションを持つ関数です。
>
{style="tip"}

次に、SwiftUIでCompose Multiplatformを表す構造体が必要です。
`UIViewController`インスタンスをSwiftUIビューに変換する次の構造体を作成します。

```swift
struct ComposeViewController: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> UIViewController {
        return Main_iosKt.MainViewController()
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
    }
}
```

これで、他のSwiftUIコードで`ComposeView`構造体を使用できるようになります。

`Main_iosKt.MainViewController`は生成された名前です。
SwiftからKotlinコードにアクセスする方法については、[Swift/Objective-Cとの相互運用性](https://kotlinlang.org/docs/native-objc-interop.html#top-level-functions-and-properties)のページで詳しく学ぶことができます。

最終的に、アプリケーションは次のようになります。

![ComposeView](compose-view.png){width=300}

この`ComposeView`は、任意のSwiftUIビュー階層で使用でき、SwiftUIコード内からそのサイズを制御できます。

Compose Multiplatformを既存のアプリケーションに組み込みたい場合は、SwiftUIが使用されている場所であればどこでも`ComposeView`構造体を使用してください。
例については、弊社の[サンプルプロジェクト](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-compose-in-swiftui)を参照してください。

## Compose Multiplatform内でSwiftUIを使用する

Compose Multiplatform内でSwiftUIを使用するには、Swiftコードを中間的な[`UIViewController`](https://developer.apple.com/documentation/uikit/uiviewcontroller/)に追加します。
現在、KotlinでSwiftUI構造を直接記述することはできません。代わりに、Swiftで記述し、Kotlin関数に渡す必要があります。

まず、`ComposeUIViewController`コンポーネントを作成するための引数をエントリポイント関数に追加します。

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

Swiftコードでは、`createUIViewController`をエントリポイント関数に渡します。
SwiftUIビューをラップするには、`UIHostingController`インスタンスを使用できます。

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

この例のコードは、[サンプルプロジェクト](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-swiftui-in-compose)で参照できます。

### マップビュー

Compose Multiplatformでマップビューを実装するには、SwiftUIの[`Map`](https://developer.apple.com/documentation/mapkit/map)コンポーネントを使用できます。
これにより、アプリケーションで完全にインタラクティブなSwiftUIマップを表示できます。

同じ[Kotlinエントリポイント関数](#use-swiftui-inside-compose-multiplatform)に対して、Swiftでは、`UIHostingController`を使用して`Map`ビューをラップする`UIViewController`を渡します。

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

次に、より高度な例を見てみましょう。このコードは、カスタムアノテーションをSwiftUIマップに追加し、Swiftからビューの状態を更新できるようにします。

```swift
import SwiftUI
import MapKit

struct AnnotatedMapView: View {
    // マップの領域状態を管理
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 51.5074, longitude: -0.1278),
        span: MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1)
    )
    // カスタムアノテーションを持つマップを表示
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

このアノテーション付きマップを`UIHostingController`でラップし、Compose Multiplatformコードに渡すことができます。

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: {
    return UIHostingController(rootView: AnnotatedMapView())
})
```

`AnnotatedMapView`は次のタスクを実行します。

*   SwiftUI `Map`ビューを定義し、それを`AnnotatedMapView`というカスタムビュー内に埋め込みます。
*   `@State`と`MKCoordinateRegion`を使用して、マップの配置に関する内部状態を管理し、Compose Multiplatformがインタラクティブで状態認識型のマップを表示できるようにします。
*   SwiftUIでアノテーションに必要とされる`Identifiable`に準拠する静的`Landmark`モデルを使用して、マップに`MapMarker`を表示します。
*   `annotationItems`を使用して、マップにカスタムマーカーを宣言的に配置します。
*   SwiftUIコンポーネントを`UIHostingController`内にラップし、それが`UIViewController`としてCompose Multiplatformに渡されます。

### カメラビュー

Compose Multiplatformでカメラビューを実装するには、SwiftUIおよびUIKitの[`UIImagePickerController`](https://developer.apple.com/documentation/uikit/uiimagepickercontroller)を
SwiftUI互換コンポーネントでラップして使用できます。これにより、アプリケーションはシステムカメラを起動して写真をキャプチャできます。

同じ[Kotlinエントリポイント関数](#use-swiftui-inside-compose-multiplatform)に対して、Swiftでは、`UIImagePickerController`を使用して基本的な`CameraView`を定義し、
`UIHostingController`を使用して埋め込みます。

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: {
    return UIHostingController(rootView: CameraView { image in
        // Handle captured image here
    })
})
```

これを機能させるには、`CameraView`を次のように定義します。

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

次に、より高度な例を見てみましょう。このコードはカメラビューを表示し、同じSwiftUIビューにキャプチャした画像のサムネイルを表示します。

```swift
import SwiftUI
import UIKit

struct CameraPreview: View {
    // カメラシートの表示/非表示を制御
    @State private var showCamera = false
    // キャプチャした画像を保存
    @State private var capturedImage: UIImage?

    var body: some View {
        VStack {
            if let image = capturedImage {
                // キャプチャした画像を表示
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .frame(height: 200)
            } else {
                // 画像がキャプチャされていない場合にプレースホルダーテキストを表示
                Text("No image captured")
            }

            // カメラを開くボタンを追加
            Button("Open Camera") {
                showCamera = true
            }
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

`CameraPreview`ビューは次のタスクを実行します。

*   ユーザーがボタンをタップしたときに、モーダル`.sheet`で`CameraView`を表示します。
*   `@State`プロパティラッパーを使用して、キャプチャした画像を保存し表示します。
*   SwiftUIのネイティブ`Image`ビューを埋め込み、写真をプレビューします。
*   以前と同じ`UIViewControllerRepresentable`ベースの`CameraView`を再利用しますが、それをSwiftUIの状態システムにさらに深く統合します。

> 実機でテストするには、アプリの`Info.plist`ファイルに`NSCameraUsageDescription`キーを追加する必要があります。
> これがない場合、アプリは実行時にクラッシュします。
>
{style="note"}

### ウェブビュー

Compose Multiplatformでウェブビューを実装するには、UIKitの[`WKWebView`](https://developer.apple.com/documentation/webkit/wkwebview)コンポーネントを
`UIViewRepresentable`でラップすることで、SwiftUIを使用できます。これにより、完全にネイティブなレンダリングで埋め込みWebコンテンツを表示できます。

同じ[Kotlinエントリポイント関数](#use-swiftui-inside-compose-multiplatform)に対して、Swiftでは、`UIHostingController`を使用して埋め込まれた基本的な`WebView`を定義します。

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: {
    let url = URL(string: "https://www.jetbrains.com")!
    return UIHostingController(rootView: WebView(url: url))
})
```

次に、より高度な例を見てみましょう。このコードは、ナビゲーションの追跡と読み込み状態の表示をウェブビューに追加します。

```swift
import SwiftUI
import UIKit
import WebKit

struct AdvancedWebView: UIViewRepresentable {
    let url: URL
    @Binding var isLoading: Bool
    @Binding var currentURL: String

    // ナビゲーションデリゲートを持つWKWebViewを作成
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        webView.load(URLRequest(url: url))
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    // Webナビゲーションイベントを処理するコーディネーターを作成
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

        // URLを更新し、読み込みが完了したことを示す
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation?) {
            isLoading = false
            currentURL = webView.url?.absoluteString ?? ""
        }
    }
}
```

これをSwiftUIビューで次のように使用します。

```swift
struct WebViewContainer: View {
    // ウェブビューの読み込み状態を追跡
    @State private var isLoading = false
    // 現在表示されているURLを追跡
    @State private var currentURL = ""

    var body: some View {
        VStack {
            // 読み込み中に読み込みインジケーターを表示
            if isLoading {
                ProgressView()
            }
            // 現在のURLを表示
            Text("URL: \(currentURL)")
                .font(.caption)
                .lineLimit(1)
                .truncationMode(.middle)

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

`AdvancedWebView`と`WebViewContainer`は次のタスクを実行します。

*   カスタムナビゲーションデリゲートを持つ`WKWebView`を作成し、読み込みの進行状況とURLの変更を追跡します。
*   SwiftUIの`@State`バインディングを使用して、ナビゲーションイベントに応答してUIを動的に更新します。
*   ページ読み込み中に`ProgressView`スピナーを表示します。
*   `Text`コンポーネントを使用して、ビューの上部に現在のURLを表示します。
*   `UIHostingController`を使用して、このコンポーネントをCompose UIに統合します。

## 次にすること

Compose Multiplatformが[UIKitフレームワークとどのように統合できるか](compose-uikit-integration.md)も探ることができます。