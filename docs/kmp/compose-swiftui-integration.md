[//]: # (title: 与 SwiftUI 框架集成)

<show-structure depth="3"/>

Compose Multiplatform 可与 [SwiftUI](https://developer.apple.com/xcode/swiftui/) 框架互操作。你可以在 SwiftUI 应用程序中嵌入 Compose Multiplatform，也可以在 Compose Multiplatform 用户界面中嵌入原生 SwiftUI 组件。本页面提供了在 SwiftUI 中使用 Compose Multiplatform 以及在 Compose Multiplatform 应用中嵌入 SwiftUI 的示例。

> 要了解 UIKit 互操作性，请参见 [](compose-uikit-integration.md) 文章。
>
{style="tip"}

## 在 SwiftUI 应用程序中使用 Compose Multiplatform

要在 SwiftUI 应用程序中使用 Compose Multiplatform，请创建一个 Kotlin 函数 `MainViewController()`，该函数返回 UIKit 中的 [`UIViewController`](https://developer.apple.com/documentation/uikit/uiviewcontroller/) 并包含 Compose Multiplatform 代码：

```kotlin
fun MainViewController(): UIViewController =
    ComposeUIViewController {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("This is Compose code", fontSize = 20.sp)
        }
    }
```

[`ComposeUIViewController()`](https://github.com/JetBrains/compose-multiplatform-core/blob/5b487914cc20df24187f9ddf54534dfec30f6752/compose/ui/ui/src/uikitMain/kotlin/androidx/compose/ui/window/ComposeWindow.uikit.kt) 是一个 Compose Multiplatform 库函数，它接受一个可组合函数作为 `content` 实参。以这种方式传入的函数可以调用其他可组合函数，例如 `Text()`。

> 可组合函数是带有 `@Composable` 注解的函数。
>
{style="tip"}

接下来，你需要一个在 SwiftUI 中代表 Compose Multiplatform 的结构体。创建以下结构体，它将 `UIViewController` 实例转换为 SwiftUI 视图：

```swift
struct ComposeViewController: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> UIViewController {
        return Main_iosKt.MainViewController()
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
    }
}
```

现在你可以在其他 SwiftUI 代码中使用 `ComposeView` 结构体了。

`Main_iosKt.MainViewController` 是一个生成名称。你可以在[与 Swift/Objective-C 互操作性](https://kotlinlang.org/docs/native-objc-interop.html#top-level-functions-and-properties)页面上了解更多关于从 Swift 访问 Kotlin 代码的信息。

最终，你的应用程序应如下所示：

![ComposeView](compose-view.png){width=300}

你可以在任何 SwiftUI 视图层级结构中使用此 `ComposeView`，并从 SwiftUI 代码中控制其大小。

如果你想将 Compose Multiplatform 嵌入到现有应用程序中，请在 SwiftUI 使用的任何地方使用 `ComposeView` 结构体。
例如，请参见我们的[示例项目](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-compose-in-swiftui)。

## 在 Compose Multiplatform 中使用 SwiftUI

要在 Compose Multiplatform 中使用 SwiftUI，请将你的 Swift 代码添加到中间 [`UIViewController`](https://developer.apple.com/documentation/uikit/uiviewcontroller/) 中。目前，你不能直接在 Kotlin 中编写 SwiftUI 结构体。相反，你必须在 Swift 中编写它们并将它们传递给 Kotlin 函数。

首先，为你的入口点函数添加一个实参以创建 `ComposeUIViewController` 组件：

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

在你的 Swift 代码中，将 `createUIViewController` 传递给你的入口点函数。
你可以使用 `UIHostingController` 实例来封装 SwiftUI 视图：

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: { () -> UIViewController in
    let swiftUIView = VStack {
        Text("SwiftUI in Compose Multiplatform")
    }
    return UIHostingController(rootView: swiftUIView)
})
```

最终，你的应用程序应如下所示：

![UIView](uiview.png){width=300}

在[示例项目](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/interop/ios-swiftui-in-compose)中探索此示例的代码。

### 地图视图

你可以使用 SwiftUI 的 [`Map`](https://developer.apple.com/documentation/mapkit/map) 组件在 Compose Multiplatform 中实现地图视图。这允许你的应用程序显示完全交互式的 SwiftUI 地图。

对于相同的 [Kotlin 入口点函数](#use-swiftui-inside-compose-multiplatform)，在 Swift 中，使用 `UIHostingController` 传递封装 `Map` 视图的 `UIViewController`：

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

现在，让我们看一个高级示例。此代码向 SwiftUI 地图添加了自定义标注，并允许你从 Swift 更新视图状态：

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

然后你可以将此带标注的地图封装在 `UIHostingController` 中，并将其传递给你的 Compose Multiplatform 代码：

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: {
    return UIHostingController(rootView: AnnotatedMapView())
})
```

`AnnotatedMapView` 执行以下任务：

* 定义一个 SwiftUI `Map` 视图并将其嵌入到名为 `AnnotatedMapView` 的自定义视图中。
* 使用 `@State` 和 `MKCoordinateRegion` 管理地图定位的内部状态，允许 Compose Multiplatform 显示一个交互式、状态感知的地图。
* 使用遵循 `Identifiable` 的静态 `Landmark` 模型在地图上显示 `MapMarker`，这是 SwiftUI 中标注所必需的。
* 使用 `annotationItems` 以声明式方式在地图上放置自定义标记。
* 将 SwiftUI 组件封装在 `UIHostingController` 中，然后将其作为 `UIViewController` 传递给 Compose Multiplatform。

### 相机视图

你可以使用 SwiftUI 和 UIKit 的 [`UIImagePickerController`](https://developer.apple.com/documentation/uikit/uiimagepickercontroller) 在 Compose Multiplatform 中实现相机视图，并将其封装在 SwiftUI 兼容的组件中。这允许你的应用程序启动系统相机并捕捉照片。

对于相同的 [Kotlin 入口点函数](#use-swiftui-inside-compose-multiplatform)，在 Swift 中，使用 `UIImagePickerController` 定义一个基本的 `CameraView`，并使用 `UIHostingController` 嵌入它：

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: {
    return UIHostingController(rootView: CameraView { image in
        // 处理此处捕捉到的图像
    })
})
```

要使此功能正常工作，请将 `CameraView` 定义如下：

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

现在，让我们看一个高级示例。此代码呈现一个相机视图，并在同一个 SwiftUI 视图中显示捕捉到的图像的缩略图：

```swift
import SwiftUI
import UIKit

struct CameraPreview: View {
    // 控制相机表单的可见性
    @State private var showCamera = false
    // 存储捕捉到的图像
    @State private var capturedImage: UIImage?

    var body: some View {
        VStack {
            if let image = capturedImage {
                // 显示捕捉到的图像
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .frame(height: 200)
            } else {
                // 未捕捉到图像时显示占位符文本
                Text("No image captured")
            }

            // 添加一个打开相机的按钮
            Button("Open Camera") {
                showCamera = true
            }
            // 将 CameraView 作为模态表单呈现
            .sheet(isPresented: $showCamera) {
                CameraView { image in
                    capturedImage = image
                }
            }
        }
    }
}
```

`CameraPreview` 视图执行以下任务：

* 当用户轻触按钮时，在模态 `.sheet` 中呈现 `CameraView`。
* 使用 `@State` 属性包装器来存储并显示捕捉到的图像。
* 嵌入 SwiftUI 的原生 `Image` 视图以预览照片。
* 复用与之前相同的基于 `UIViewControllerRepresentable` 的 `CameraView`，但将其更深入地集成到 SwiftUI 状态系统。

> 要在真实设备上测试，你需要将 `NSCameraUsageDescription` 键添加到应用的 `Info.plist` 文件中。否则，应用将在运行时崩溃。
>
{style="note"}

### 网页视图

你可以通过使用 `UIViewRepresentable` 封装 UIKit 的 [`WKWebView`](https://developer.apple.com/documentation/webkit/wkwebview) 组件，在 Compose Multiplatform 中使用 SwiftUI 实现网页视图。这允许你显示带有完整原生渲染的嵌入式网页内容。

对于相同的 [Kotlin 入口点函数](#use-swiftui-inside-compose-multiplatform)，在 Swift 中，定义一个使用 `UIHostingController` 嵌入的基本 `WebView`：

```swift
Main_iosKt.ComposeEntryPointWithUIViewController(createUIViewController: {
    let url = URL(string: "https://www.jetbrains.com")!
    return UIHostingController(rootView: WebView(url: url))
})
```

现在，让我们看一个高级示例。此代码向网页视图添加了导航跟踪和加载状态显示：

```swift
import SwiftUI
import UIKit
import WebKit

struct AdvancedWebView: UIViewRepresentable {
    let url: URL
    @Binding var isLoading: Bool
    @Binding var currentURL: String

    // 创建带导航委托的 WKWebView
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        webView.load(URLRequest(url: url))
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    // 创建协调器以处理网页导航事件
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

        // 更新 URL 并指示加载已完成
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation?) {
            isLoading = false
            currentURL = webView.url?.absoluteString ?? ""
        }
    }
}
```

在 SwiftUI 视图中按如下方式使用它：

```swift
struct WebViewContainer: View {
    // 跟踪网页视图的加载状态
    @State private var isLoading = false
    // 跟踪当前显示的 URL
    @State private var currentURL = ""

    var body: some View {
        VStack {
            // 加载时显示加载指示器
            if isLoading {
                ProgressView()
            }
            // 显示当前 URL
            Text("URL: \(currentURL)")
                .font(.caption)
                .lineLimit(1)
                .truncationMode(.middle)

            // 嵌入高级网页视图
            AdvancedWebView(
                url: URL(string: "https://www.jetbrains.com")!,
                isLoading: $isLoading,
                currentURL: $currentURL
            )
        }
    }
}
```

`AdvancedWebView` 和 `WebViewContainer` 执行以下任务：

* 创建一个带有自定义导航委托的 `WKWebView`，以跟踪加载进度和 URL 变更。
* 使用 SwiftUI 的 `@State` 绑定来动态更新用户界面以响应导航事件。
* 在页面加载时显示 `ProgressView` 微调器。
* 使用 `Text` 组件在视图顶部显示当前 URL。
* 使用 `UIHostingController` 将此组件集成到你的 Compose 用户界面中。

## 下一步

你还可以探索 Compose Multiplatform [与 UIKit 框架集成](compose-uikit-integration.md)的方式。