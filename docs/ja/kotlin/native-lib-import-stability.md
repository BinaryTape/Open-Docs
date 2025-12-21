[//]: # (title: C、Objective-C、およびSwiftライブラリのインポート)

Kotlin/Nativeは、[C](native-c-interop.md)および[Objective-C](native-objc-interop.md)ライブラリのインポート機能を提供します。
また、純粋な[Swiftライブラリ](#swift-library-import)をKotlin/Nativeプロジェクトにインポートするための回避策もあります。

## CおよびObjective-Cライブラリのインポートの安定性
<primary-label ref="beta"/>

CおよびObjective-Cライブラリのインポートのサポートは現在[ベータ版](components-stability.md#kotlin-native)です。

ベータ版である主な理由の1つは、CおよびObjective-Cライブラリを使用すると、Kotlin、依存関係、およびXcodeの異なるバージョンとのコードの互換性に影響を与える可能性があることです。このガイドでは、実際に頻繁に発生する互換性の問題、一部のケースでのみ発生する問題、および潜在的な仮想的な問題を挙げています。

簡略化のため、ここではCおよびObjective-Cライブラリ、または_ネイティブライブラリ_を以下に分類します。

* [プラットフォームライブラリ](#platform-libraries)：これは、各プラットフォームの「システム」ネイティブライブラリにアクセスするためにKotlinがデフォルトで提供するものです。
* [サードパーティライブラリ](#third-party-libraries)：Kotlinでの使用に追加の設定が必要な、その他のすべてのネイティブライブラリです。

これら2種類のネイティブライブラリは異なる互換性の特性を持っています。

### プラットフォームライブラリ

[_プラットフォームライブラリ_](native-platform-libs.md)はKotlin/Nativeコンパイラに同梱されています。
そのため、プロジェクトで異なるバージョンのKotlinを使用すると、異なるバージョンのプラットフォームライブラリが使用されることになります。
Appleターゲット（iOSなど）の場合、プラットフォームライブラリはXcodeのバージョンに基づいて生成されます。これは特定のコンパイラのバージョンによってサポートされます。

Xcode SDKに同梱されているネイティブライブラリAPIはXcodeのバージョンごとに変更されます。
このような変更がネイティブ言語内でソース互換性およびバイナリ互換性がある場合でも、相互運用性の実装によりKotlinでは破壊的になる可能性があります。

その結果、プロジェクトでKotlinのバージョンを更新すると、プラットフォームライブラリに破壊的な変更をもたらす可能性があります。
これは2つのケースで問題になる可能性があります。

* プラットフォームライブラリにソースの破壊的な変更があり、それがプロジェクトのソースコードのコンパイルに影響する場合です。通常、これは簡単に修正できます。
* プラットフォームライブラリにバイナリの破壊的な変更があり、それが一部の依存関係に影響する場合です。
  通常、簡単な回避策はなく、ライブラリ開発者が自身の側でこれを修正するまで待つ必要があります。例えば、Kotlinのバージョンを更新することによって。

  > このようなバイナリの非互換性は、リンケージ警告やランタイム例外として現れます。
  > コンパイル時にそれらを検出したい場合は、コンパイラオプション [`-Xpartial-linkage-loglevel=ERROR`](whatsnew19.md#library-linkage-in-kotlin-native) を使用して、警告をエラーに昇格させてください。
  >
  {style="note"}

JetBrainsチームがプラットフォームライブラリの生成に使用するXcodeバージョンを更新する際、プラットフォームライブラリに破壊的な変更が生じないよう合理的な努力を払っています。破壊的な変更が発生する可能性がある場合は常に、チームは影響分析を実施し、特定の変更を無視するか（影響を受けるAPIが一般的に使用されていないため）、またはアドホックな修正を適用するかを決定します。

プラットフォームライブラリにおける破壊的変更のもう1つの潜在的な理由は、ネイティブAPIをKotlinに変換するアルゴリズムの変更です。JetBrainsチームは、このような場合でも破壊的な変更を避けるために合理的な努力を払っています。

#### プラットフォームライブラリからの新しいObjective-Cクラスの使用

Kotlinコンパイラは、デプロイメントターゲットで利用できないObjective-Cクラスの使用を妨げません。

例えば、デプロイメントターゲットがiOS 17.0で、iOS 18.0でしか登場しないクラスを使用した場合、コンパイラは警告を発せず、iOS 17.0を搭載したデバイスでの起動中にアプリケーションがクラッシュする可能性があります。
さらに、このようなクラッシュは、実行がそれらの使用箇所に到達しない場合でも発生するため、バージョンチェックでガードするだけでは不十分です。

詳細については、[ストロングリンク](native-objc-interop.md#strong-linking)を参照してください。

### サードパーティライブラリ

システムプラットフォームライブラリとは別に、Kotlin/Nativeはサードパーティのネイティブライブラリのインポートを可能にします。
例えば、[CocoaPods連携](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)を使用するか、[cinteropsの設定](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#cinterops)を行うことができます。

#### Xcodeバージョンが一致しないライブラリのインポート

サードパーティのネイティブライブラリをインポートすると、異なるXcodeバージョンとの互換性の問題につながる可能性があります。

ネイティブライブラリを処理する際、コンパイラは通常、ローカルにインストールされたXcodeのヘッダーファイルを使用します。これは、ほとんどすべてのネイティブライブラリのヘッダーがXcodeから提供される「標準」ヘッダー（例えば `stdint.h`）をインポートするためです。

そのため、XcodeのバージョンはKotlinへのネイティブライブラリのインポートに影響します。これは、サードパーティのネイティブライブラリを使用する場合に、[非MacホストからのAppleターゲットのクロスコンパイル](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html#compilation-for-apple-targets)がまだ不可能な理由の1つでもあります。

すべてのKotlinバージョンは、単一のXcodeバージョンと最も互換性があります。これは推奨されるバージョンであり、対応するKotlinバージョンに対して最もテストされています。
特定のXcodeバージョンとの互換性は、[互換性表](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#version-compatibility)で確認してください。

より新しい、または古いXcodeバージョンを使用することは多くの場合可能ですが、問題を引き起こす可能性があります。通常はサードパーティのネイティブライブラリのインポートに影響します。

##### Xcodeバージョンが推奨よりも新しい場合

推奨よりも新しいXcodeバージョンを使用すると、一部のKotlin機能が破損する可能性があります。特にサードパーティのネイティブライブラリのインポートがこれによって最も影響を受けます。サポートされていないバージョンのXcodeでは、まったく機能しないことがよくあります。

##### Xcodeバージョンが推奨よりも古い場合

通常、Kotlinは古いXcodeバージョンでもうまく動作します。ただし、時折問題が発生し、その結果は次のとおりです。

* Kotlin APIが、[KT-71694](https://youtrack.jetbrains.com/issue/KT-71694)のように存在しない型を参照する。
* システムライブラリの型がネイティブライブラリのKotlin APIに含まれる。
  この場合、プロジェクトは正常にコンパイルされますが、システムネイティブ型がネイティブライブラリパッケージに追加されます。
  例えば、IDEのオートコンプリートでこの型が予期せず表示されることがあります。

もしあなたのKotlinライブラリが古いXcodeバージョンで正常にコンパイルされる場合、[KotlinライブラリAPIでサードパーティライブラリの型を使用](#using-native-types-in-library-api)しない限り、公開しても安全です。

#### 推移的なサードパーティのネイティブ依存関係の使用

プロジェクト内のKotlinライブラリがその実装の一部としてサードパーティのネイティブライブラリをインポートすると、あなたのプロジェクトもそのネイティブライブラリにアクセスできるようになります。
これは、Kotlin/Nativeが `api` と `implementation` の依存関係の型を区別しないためであり、そのためネイティブライブラリは常に `api` 依存関係となります。

このような推移的なネイティブ依存関係を使用することは、より多くの互換性の問題を引き起こしやすいです。
例えば、Kotlinライブラリ開発者による変更によって、ネイティブライブラリのKotlin表現が非互換になる可能性があり、Kotlinライブラリを更新する際に互換性の問題につながります。

そのため、推移的な依存関係に頼るのではなく、同じネイティブライブラリとの相互運用性を直接設定してください。
そのためには、互換性の問題を防止するために[カスタムパッケージ名を使用する](#use-custom-package-name)のと同様に、ネイティブライブラリに別のパッケージ名を使用します。

#### ライブラリAPIでのネイティブ型の使用

Kotlinライブラリを公開する場合、ライブラリAPIでのネイティブ型の扱いに注意してください。このような使用法は、互換性やその他の問題を修正するために将来的に壊れる可能性があります。これはライブラリユーザーに影響を及ぼします。

ライブラリのAPIでネイティブ型を使用することが、ライブラリの目的のために必要となる場合があります。例えば、Kotlinライブラリが基本的にネイティブライブラリへの拡張機能を提供するような場合です。
そうでない場合は、ライブラリAPIでのネイティブ型の使用を避けるか、制限してください。

この推奨事項は、ライブラリAPIにおけるネイティブ型の使用にのみ適用され、アプリケーションコードとは関係ありません。
また、ライブラリの実装にも適用されません。例えば、

```kotlin
// 特に注意してください！ライブラリAPIでネイティブ型が使用されています:
public fun createUIView(): UIView
public fun handleThirdPartyNativeType(c: ThirdPartyNativeType)

// 通常通り注意してください。ライブラリAPIではネイティブ型は使用されていません:
internal fun createUIViewController(): UIViewController
public fun getDate(): String = NSDate().toString()
```

#### サードパーティライブラリを使用するライブラリの公開

サードパーティのネイティブライブラリを使用するKotlinライブラリを公開する場合、互換性の問題を回避するためにいくつかの対策を講じることができます。

##### カスタムパッケージ名の使用

サードパーティのネイティブライブラリにカスタムパッケージ名を使用すると、互換性の問題を防止するのに役立つ場合があります。

ネイティブライブラリがKotlinにインポートされると、Kotlinのパッケージ名が割り当てられます。それが一意でない場合、ライブラリユーザーは衝突を経験する可能性があります。例えば、ユーザーのプロジェクト内の他の場所や他の依存関係で同じパッケージ名でネイティブライブラリがインポートされている場合、それら2つの使用法は衝突します。

このような場合、コンパイルは `Linking globals named '...': symbol multiply defined!` エラーで失敗する可能性があります。
ただし、他のエラーが発生したり、コンパイルが成功する場合もあります。

サードパーティのネイティブライブラリにカスタム名を使用するには：

* CocoaPods連携を介してネイティブライブラリをインポートする場合、Gradleビルドスクリプトの `pod {}` ブロックで [`packageName`](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html#pod-function) プロパティを使用します。
* `cinterops` 設定でネイティブライブラリをインポートする場合、設定ブロックで [`packageName`](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#cinterops) プロパティを使用します。

##### 古いKotlinバージョンとの互換性の確認

Kotlinライブラリを公開する場合、サードパーティのネイティブライブラリの使用は、他のKotlinバージョンとのライブラリ互換性に影響を与える可能性があります。具体的には次のとおりです。

* Kotlin Multiplatformライブラリは、前方互換性（古いコンパイラが新しいコンパイラでコンパイルされたライブラリを使用できること）を保証しません。

  実際には、一部のケースでは機能します。ただし、ネイティブライブラリを使用すると、前方互換性がさらに制限される可能性があります。

* Kotlin Multiplatformライブラリは、後方互換性（新しいコンパイラが古いバージョンで生成されたライブラリを使用できること）を提供します。

  Kotlinライブラリでネイティブライブラリを使用しても、通常、その後方互換性には影響しません。
  しかし、互換性に影響するより多くのコンパイラのバグが発生する可能性が開かれます。

##### スタティックライブラリの埋め込みを避ける

ネイティブライブラリをインポートする際、`-staticLibrary` コンパイラオプションまたは `.def` ファイルの `staticLibraries` プロパティを使用して、関連する[スタティックライブラリ](native-definition-file.md#include-a-static-library)（`.a` ファイル）を含めることが可能です。
この場合、ライブラリユーザーはネイティブ依存関係やリンカーオプションに対処する必要がありません。

しかし、含まれているスタティックライブラリの使用方法を、いかなる方法でも設定することはできません。つまり、除外したり、置換（代替）したりすることはできません。
そのため、ユーザーは同じスタティックライブラリを含む他のKotlinライブラリとの潜在的な衝突を解決したり、そのバージョンを調整したりすることができなくなります。

### ネイティブライブラリサポートの進化

現在、KotlinプロジェクトでCおよびObjective-Cを使用すると、互換性の問題が発生する可能性があり、その一部はこのガイドに記載されています。
これらを修正するためには、将来的にいくつかの破壊的な変更が必要になる可能性があり、それ自体が互換性の問題に寄与します。

## Swiftライブラリのインポート

Kotlin/Nativeは、純粋なSwiftライブラリの直接インポートをサポートしていません。ただし、それを回避するためのいくつかのオプションがあります。

1つの方法は、手動のObjective-Cブリッジを使用することです。このアプローチでは、カスタムのObjective-Cラッパーと `.def` ファイルを作成し、それらのラッパーをcinterop経由で利用する必要があります。

しかし、ほとんどの場合、_リバースインポート_のアプローチを使用することをお勧めします。これは、Kotlin側で期待される動作を定義し、Swift側で実際の機能を実装し、それをKotlinに渡すというものです。

期待される部分は、以下の2つの方法のいずれかで定義できます。

* インターフェースを作成する。インターフェースベースのアプローチは、複数の関数やテスト容易性に対してより優れたスケーラビリティを発揮します。
* Swiftクロージャを使用する。これらはクイックプロトタイプには適していますが、このアプローチには制限があります。例えば、状態を保持しません。

Kotlinプロジェクトに[CryptoKit](https://developer.apple.com/documentation/cryptokit/) Swiftライブラリをリバースインポートする例を次に示します。

<tabs>
<tab title="インターフェース">

1. Kotlin側で、KotlinがSwiftに期待するものを記述するインターフェースを作成します。

   ```kotlin
   // CryptoProvider.kt
   interface CryptoProvider {
       fun hashMD5(input: String): String
   }
   ```

2. Swift側で、純粋なSwiftライブラリであるCryptoKitを使用してMD5ハッシュ機能を実装します。

    ```swift
    // iosApp/ContentView.swift
    import CryptoKit
    
    class IosCryptoProvider: CryptoProvider {
        func hashMD5(input: String) -> String {
            guard let data = input.data(using: .utf8) else { return "failed" }
            return Insecure.MD5.hash(data: data).description
        }
    }
    ```

3. Swiftの実装をKotlinコンポーネントに渡します。

   ```swift
   // iosApp/ContentView.swift
   struct ComposeView: UIViewControllerRepresentable {
       func makeUIViewController(context: Context) -> UIViewController {
           // Swiftの実装をKotlin UIのエントリーポイントに注入
           MainViewControllerKt.MainViewController(cryptoProvider: IosCryptoProvider())
       }

       func updateUIViewController(_ uiViewController: UIViewController, context: UIViewControllerRepresentableContext<ComposeView>) {}
   }
   ```

</tab>
<tab title="Swiftクロージャ">

1. Kotlin側で、関数パラメータを宣言し、必要な場所で使用します。

    ```kotlin
    // App.kt
    @Composable
    fun App(md5Hasher: (String) -> String) {
        // UI内での使用例
        val hashed = md5Hasher("Hello, world!")
        androidx.compose.material3.Text("Compose: $hashed")
    }
    ```

    ```kotlin
    // MainViewController.kt
    fun MainViewController(md5Hasher: (String) -> String) = ComposeUIViewController {
        App(md5Hasher)
    }
    ```

2. Swift側で、CryptoKitライブラリを使用してMD5ハッシャーを構築し、クロージャとして渡します。

    ```swift
    // iosApp/ContentView.swift
    import CryptoKit
    import SwiftUI

    struct ComposeView: UIViewControllerRepresentable {
        func makeUIViewController(context: Context) -> UIViewController {
            MainViewControllerKt.MainViewController(md5Hasher: { input in
                guard let data = input.data(using: .utf8) else { return "failed" }
                return Insecure.MD5.hash(data: data).description
            })
        }

        func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
    }
    ```

</tab>
</tabs>

より複雑なプロジェクトでは、依存性注入を使用してSwiftの実装をKotlinに渡す方が便利です。
詳細については、[依存性注入フレームワーク](https://kotlinlang.org/docs/multiplatform/multiplatform-connect-to-apis.html#dependency-injection-framework)を参照するか、[Koinフレームワーク](https://insert-koin.io/docs/reference/koin-mp/kmp/)のドキュメントを確認してください。