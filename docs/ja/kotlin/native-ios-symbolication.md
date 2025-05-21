---
title: iOSクラッシュレポートのシンボル化
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

iOSアプリケーションのクラッシュをデバッグするには、クラッシュレポートの分析が必要になる場合があります。
クラッシュレポートの詳細については、[Apple documentation](https://developer.apple.com/library/archive/technotes/tn2151/_index.html)を参照してください。

通常、クラッシュレポートを適切に判読できるようにするには、シンボル化が必要です。
シンボル化とは、マシンコードのアドレスを人間が読めるソースの場所に変換することです。
以下のドキュメントでは、Kotlinを使用したiOSアプリケーションのクラッシュレポートをシンボル化する際の具体的な詳細について説明します。

## リリースKotlinバイナリ用の.dSYMの生成

Kotlinコードのアドレスをシンボル化するには（たとえば、Kotlinコードに対応するスタックトレース要素の場合）、Kotlinコード用の`.dSYM`バンドルが必要です。

デフォルトでは、Kotlin/Nativeコンパイラーは、Darwinプラットフォーム上のリリース（つまり、最適化された）バイナリ用に`.dSYM`を生成します。これは、`-Xadd-light-debug=disable`コンパイラーフラグで無効にできます。同時に、このオプションは他のプラットフォームではデフォルトで無効になっています。有効にするには、`-Xadd-light-debug=enable`コンパイラーオプションを使用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug=\{enable|disable\}"
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug=\{enable|disable\}"
        }
    }
}
```

</TabItem>
</Tabs>

IntelliJ IDEAまたはAppCodeテンプレートから作成されたプロジェクトでは、これらの`.dSYM`バンドルはXcodeによって自動的に検出されます。

## bitcodeからの再構築を使用する場合は、フレームワークを静的にする

bitcodeからKotlinで生成されたフレームワークを再構築すると、元の`.dSYM`が無効になります。
ローカルで実行する場合は、クラッシュレポートをシンボル化するときに、更新された`.dSYM`が使用されていることを確認してください。

再構築がApp Store側で実行される場合、再構築された*動的*フレームワークの`.dSYM`は破棄され、App Store Connectからダウンロードできないようです。
この場合、フレームワークを静的にする必要がある場合があります。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.withType<org.jetbrains.kotlin.gradle.plugin.mpp.Framework> {
            isStatic = true
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.withType(org.jetbrains.kotlin.gradle.plugin.mpp.Framework) {
            isStatic = true
        }
    }
}
```

</TabItem>
</Tabs>