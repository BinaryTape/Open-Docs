[//]: # (title: 異なるプラットフォームにおけるデフォルトのUI動作)

Compose Multiplatformは、異なるプラットフォームで可能な限り同様に動作するアプリを開発するのに役立つことを目指しています。
このページでは、Compose Multiplatformで異なるプラットフォーム向けの共有UIコードを記述する際に予期すべき、避けられない相違点や一時的な妥協点について説明します。

## プロジェクト構造

ターゲットとするプラットフォームに関係なく、それぞれに専用のエントリポイントが必要です。

*   Androidの場合、それは`Activity`であり、共通コードからメインのコンポーザブルを表示する役割を担います。
*   iOSアプリの場合、それはアプリを初期化する`@main`クラスまたは構造体です。
*   JVMアプリの場合、それはメインの共通コンポーザブルを起動するアプリケーションを開始する`main()`関数です。
*   Kotlin/JSまたはKotlin/Wasmアプリの場合、それはメインの共通コードコンポーザブルをウェブページにアタッチする`main()`関数です。

アプリに必要な特定のプラットフォーム固有のAPIには、マルチプラットフォームサポートがない場合があり、それらのAPIの呼び出しはプラットフォーム固有のソースセットで実装する必要があります。
そうする前に、[klibs.io](https://klibs.io/)を確認してください。これは、利用可能なすべてのKotlin Multiplatformライブラリを包括的にカタログ化することを目的としたJetBrainsプロジェクトです。
すでにネットワークコード、データベース、コルーチンなど、多くのライブラリが利用可能です。

## 入力方法

### ソフトウェアキーボード

各プラットフォームでは、テキストフィールドがアクティブになったときにキーボードが表示される方法を含め、ソフトウェアキーボードの処理方法が多少異なる場合があります。

Compose Multiplatformは、[Composeのウィンドウインセットアプローチ](https://developer.android.com/develop/ui/compose/system/insets)を採用しており、
[セーフエリア](https://developer.apple.com/documentation/UIKit/positioning-content-relative-to-the-safe-area)を考慮するためにiOSでそれを模倣しています。
実装によっては、ソフトウェアキーボードがiOSで少し異なる位置に配置される場合があります。
キーボードが両方のプラットフォームで重要なUI要素を覆わないことを確認してください。

Compose Multiplatformは現在、デフォルトのIMEアクションの変更をサポートしていません。例えば、通常の&crarr;アイコンの代わりに、虫眼鏡やチェックマークを表示するなどです。

### タッチとマウスのサポート

現在のデスクトップ実装では、すべてのポインター操作をマウスジェスチャーとして解釈するため、マルチタッチジェスチャーはサポートしていません。
例えば、一般的なピンチズームジェスチャーは、2つのタッチを同時に処理する必要があるため、デスクトップ版Compose Multiplatformでは実装できません。

## UIの動作と外観

### プラットフォーム固有の機能

一部の一般的なUI要素はCompose Multiplatformではカバーされておらず、フレームワークを使用してカスタマイズすることはできません。
したがって、それらが異なるプラットフォームで異なって見えることを予期すべきです。

ネイティブのポップアップビューがその一例です。
Compose Multiplatformのテキストフィールドでテキストを選択すると、**コピー**や**翻訳**といったデフォルトの推奨アクションは、アプリが実行されているプラットフォームに固有のものになります。

### スクロール物理

AndroidとiOSでは、スクロール感がプラットフォームに合わせられています。
デスクトップでは、スクロールサポートはマウスホイールに限定されます（[undefined](#touch-and-mouse-support)で言及されているとおり）。

### 相互運用ビュー

共通のコンポーザブル内にネイティブビューを埋め込みたい場合、またはその逆の場合、
Compose Multiplatformでサポートされているプラットフォーム固有のメカニズムについてよく理解しておく必要があります。

iOS向けには、[SwiftUI](compose-swiftui-integration.md)および[UIKit](compose-uikit-integration.md)との相互運用コードに関する個別のガイドがあります。

デスクトップ向けには、Compose Multiplatformは[Swingの相互運用性](compose-desktop-swing-interoperability.md)をサポートしています。

### 戻るジェスチャー

Androidデバイスはデフォルトで戻るジェスチャーをサポートしており、すべての画面が**戻る**ボタンに何らかの形で反応します。

iOSでは、デフォルトでは戻るジェスチャーはありませんが、開発者はユーザーエクスペリエンスの期待に応えるために同様の機能を実装することが推奨されています。
iOS版Compose Multiplatformは、Androidの機能を模倣するために、デフォルトで戻るジェスチャーをサポートしています。

デスクトップでは、Compose Multiplatformは**Esc**キーをデフォルトの戻るトリガーとして使用します。

詳細は、[undefined](compose-navigation.md#back-gesture)セクションを参照してください。

### テキスト

テキストに関して、Compose Multiplatformは異なるプラットフォーム間でのピクセル単位での完全な一致を保証しません。

*   明示的にフォントを設定しない場合、各システムがテキストに異なるデフォルトフォントを割り当てます。
*   同じフォントを使用した場合でも、各プラットフォームに固有の文字のアンチエイリアシングメカニズムにより、目立つ違いが生じる可能性があります。

これはユーザーエクスペリエンスに大きな影響を与えません。それどころか、デフォルトフォントは各プラットフォームで期待通りに表示されます。
しかし、ピクセルの違いは、例えばスクリーンショットテストの妨げとなる場合があります。

<!-- this should be covered in benchmarking, not as a baseline Compose Multiplatform limitation 
### Initial performance

On iOS, you may notice a delay in the initial performance of individual screens compared to Android.
This can happen because Compose Multiplatform compiles UI shaders on demand.
So, if a particular shader is not cached yet, compiling it may delay rendering of a scene.

This issue affects only the first launch of each screen.
Once all necessary shaders are cached, subsequent launches are not delayed by compilation.
-->

## 開発者エクスペリエンス

### プレビュー

_プレビュー_とは、IDEで利用できる、コンポーザブルの非インタラクティブなレイアウト表示のことです。

コンポーザブルのプレビューを表示するには：

1.  Androidターゲットがまだプロジェクトにない場合は追加します（プレビューメカニズムはAndroidライブラリを使用します）。
2.  プレビュー可能にしたいコンポーザブルに、共通コードで`@Preview`アノテーションを付けます。
3.  エディターウィンドウで**分割**または**デザイン**ビューに切り替えます。
    まだプロジェクトをビルドしていない場合、初めてプロジェクトをビルドするように促されます。

IntelliJ IDEAとAndroid Studioの両方で、現在のファイル内の`@Preview`でアノテーション付けされたすべてのコンポーザブルの初期レイアウトを確認できます。

### ホットリロード

_ホットリロード_とは、追加の入力を必要とせずに、アプリがコード変更をその場で反映することを指します。
Compose Multiplatformでは、ホットリロード機能はJVM（デスクトップ）ターゲットでのみ利用可能です。
しかし、これを使用して問題を迅速にトラブルシューティングし、微調整のために目的のプラットフォームに切り替える前に利用することができます。

詳細については、[Composeホットリロード](compose-hot-reload.md)の記事を参照してください。

## 次のステップ

次のコンポーネントにおけるCompose Multiplatformの実装について、さらに学習してください。
*   [リソース](compose-multiplatform-resources.md)
*   [ライフサイクル](compose-lifecycle.md)
*   [共通ViewModel](compose-viewmodel.md)
*   [ナビゲーションとルーティング](compose-navigation-routing.md)