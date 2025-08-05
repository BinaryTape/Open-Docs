[//]: # (title: 異なるプラットフォームでのデフォルトUIの動作)

Compose Multiplatform は、異なるプラットフォームで可能な限り同様に動作するアプリを開発できるよう支援します。
このページでは、Compose Multiplatform を使用して異なるプラットフォーム向けに共有UIコードを記述する際に予期すべき、避けられない違いや一時的な妥協点について説明します。

## プロジェクト構造

対象とするプラットフォームに関わらず、それぞれに専用のエントリポイントが必要です。

*   Android の場合、それは `Activity` であり、その役割は共通コードからメインのコンポーザブルを表示することです。
*   iOS アプリの場合、それはアプリを初期化する `@main` クラスまたは構造体です。
*   JVM アプリの場合、それはメインの共通コンポーザブルを起動するアプリケーションを開始する `main()` 関数です。
*   Kotlin/JS または Kotlin/Wasm アプリの場合、それはメインの共通コードコンポーザブルをウェブページにアタッチする `main()` 関数です。

アプリに必要な特定のプラットフォーム固有のAPIは、マルチプラットフォームをサポートしていない場合があり、これらのAPIの呼び出しをプラットフォーム固有のソースセットで実装する必要があります。
そうする前に、[klibs.io](https://klibs.io/) を確認してください。これは、利用可能なすべての Kotlin Multiplatform ライブラリを包括的にカタログ化することを目的とした JetBrains のプロジェクトです。
ネットワークコード、データベース、コルーチンなど、すでに多くのライブラリが利用可能です。

## 入力方法

### ソフトウェアキーボード

各プラットフォームでは、テキストフィールドがアクティブになったときのキーボードの表示方法を含め、ソフトウェアキーボードの処理がわずかに異なる場合があります。

Compose Multiplatform は、[Compose のウィンドウインセットのアプローチ](https://developer.android.com/develop/ui/compose/system/insets)を採用し、[セーフエリア](https://developer.apple.com/documentation/UIKit/positioning-content-relative-to-the-safe-area)を考慮して iOS でそれを模倣しています。
実装によっては、iOS でソフトウェアキーボードの位置が少し異なる場合があります。
両方のプラットフォームでキーボードが重要なUI要素を覆わないように確認してください。

Compose Multiplatform は現在、デフォルトの IME アクションの変更をサポートしていません。例えば、通常の &crarr; アイコンの代わりに虫眼鏡やチェックマークを表示するといったことはできません。

### タッチとマウスのサポート

現在のデスクトップ実装では、すべてのポインター操作をマウスジェスチャーとして解釈するため、マルチタッチジェスチャーはサポートされていません。
例えば、一般的なピンチイン・ピンチアウトのジェスチャーは、一度に2つのタッチを処理する必要があるため、デスクトップ向けの Compose Multiplatform では実装できません。

## UIの動作と外観

### プラットフォーム固有の機能

一部の一般的なUI要素は Compose Multiplatform の対象外であり、フレームワークを使用してカスタマイズすることはできません。
そのため、異なるプラットフォームでそれらが異なって見えることを想定しておく必要があります。

ネイティブのポップアップビューがその一例です。
Compose Multiplatform のテキストフィールドでテキストを選択すると、**コピー**や**翻訳**のようなデフォルトの提案アクションは、アプリが実行されているプラットフォームに固有のものになります。

### スクロールの物理特性

Android と iOS では、スクロールの感触はプラットフォームに合わせられています。
デスクトップの場合、スクロールのサポートはマウスホイールに限定されます (前述の[](#touch-and-mouse-support)を参照)。

### 相互運用ビュー

共通のコンポーザブル内にネイティブビューを埋め込みたい場合、またはその逆の場合、Compose Multiplatform がサポートするプラットフォーム固有のメカニズムに慣れる必要があります。

iOS の場合、[SwiftUI](compose-swiftui-integration.md) および [UIKit](compose-uikit-integration.md) との相互運用コードに関する個別のガイドがあります。

デスクトップの場合、Compose Multiplatform は[](compose-desktop-swing-interoperability.md)をサポートしています。

### 戻るジェスチャー

Android デバイスはデフォルトで戻るジェスチャーをサポートしており、すべての画面が何らかの形で**戻る**ボタンに反応します。

iOS にはデフォルトで戻るジェスチャーはありませんが、開発者はユーザー体験の期待に応えるために同様の機能を実装することが推奨されています。
iOS 向け Compose Multiplatform は、Android の機能を模倣するために、デフォルトで戻るジェスチャーをサポートしています。

デスクトップでは、Compose Multiplatform は**Esc**キーをデフォルトの戻るトリガーとして使用します。

詳細については、[](compose-navigation.md#back-gesture)セクションを参照してください。

### テキスト

テキストに関して、Compose Multiplatform は異なるプラットフォーム間でのピクセルパーフェクトな対応を保証しません。

*   フォントを明示的に設定しない場合、各システムがテキストに異なるデフォルトフォントを割り当てます。
*   同じフォントであっても、各プラットフォームに固有の文字アンチエイリアシングのメカニズムが、目に見える違いを引き起こす可能性があります。

これはユーザー体験に大きな影響を与えません。それどころか、デフォルトのフォントは各プラットフォームで期待どおりに表示されます。
ただし、ピクセルの違いは、例えばスクリーンショットテストに影響を与える可能性があります。

<!-- this should be covered in benchmarking, not as a baseline Compose Multiplatform limitation
### Initial performance

On iOS, you may notice a delay in the initial performance of individual screens compared to Android.
This can happen because Compose Multiplatform compiles UI shaders on demand.
So, if a particular shader is not cached yet, compiling it may delay rendering of a scene.

This issue affects only the first launch of each screen.
Once all necessary shaders are cached, subsequent launches are not delayed by compilation.
-->

## 開発者体験

### プレビュー

_プレビュー_とは、IDEで利用可能な、操作できないコンポーザブルのレイアウト表示のことです。

コンポーザブルのプレビューを表示するには：

1.  Android ターゲットがプロジェクトにない場合は追加します（プレビューメカニズムは Android ライブラリを使用します）。
2.  プレビュー可能にしたいコンポーザブルを、共通コードで `@Preview` アノテーションを付けてマークします。
3.  エディターウィンドウで**Split**または**Design**ビューに切り替えます。まだプロジェクトをビルドしていない場合、初回ビルドを促されます。

IntelliJ IDEA と Android Studio の両方で、現在のファイル内の `@Preview` アノテーションが付与されたすべてのコンポーザブルの初期レイアウトを確認できます。

### ホットリロード

_ホットリロード_とは、追加の入力なしに、アプリがコード変更を即座に反映することを指します。
Compose Multiplatform では、ホットリロード機能は JVM (デスクトップ) ターゲットでのみ利用可能です。
ただし、最終調整のために目的のプラットフォームに切り替える前に、問題のトラブルシューティングを迅速に行うために使用できます。

詳細については、[](compose-hot-reload.md)の記事を参照してください。

## 次のステップ

以下のコンポーネントに対する Compose Multiplatform の実装について、さらに詳しくお読みください。
*   [リソース](compose-multiplatform-resources.md)
*   [](compose-lifecycle.md)
*   [](compose-viewmodel.md)
*   [](compose-navigation-routing.md)