[//]: # (title: iOSクラッシュレポートのシンボリケーション)

iOSアプリケーションのクラッシュのデバッグには、クラッシュレポートの分析を伴う場合があります。
クラッシュレポートに関する詳細情報は、[Appleのドキュメント](https://developer.apple.com/library/archive/technotes/tn2151/_index.html)で確認できます。

クラッシュレポートが適切に読み取り可能になるには、通常シンボリケーションが必要です。シンボリケーションは、マシンコードのアドレスを人間が読み取り可能なソースロケーションに変換します。
以下のドキュメントでは、Kotlinを使用するiOSアプリケーションからのクラッシュレポートをシンボリケーションする際の具体的な詳細について説明します。

## リリース版Kotlinバイナリ用の.dSYMの生成

Kotlinコード内のアドレスをシンボリケーションするには(例: Kotlinコードに対応するスタックトレース要素の場合)、Kotlinコード用の`.dSYM`バンドルが必要です。

デフォルトでは、Kotlin/NativeコンパイラはDarwinプラットフォーム上のリリース版(つまり最適化された)バイナリに対して`.dSYM`を生成します。これは、`-Xadd-light-debug=disable`コンパイラフラグで無効にできます。同時に、このオプションは他のプラットフォームではデフォルトで無効になっています。有効にするには、`-Xadd-light-debug=enable`コンパイラオプションを使用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

</tab>
</tabs>

IntelliJ IDEAまたはAppCodeのテンプレートから作成されたプロジェクトでは、これらの`.dSYM`バンドルはXcodeによって自動的に検出されます。

## ビットコードからのリビルドを使用する際のフレームワークの静的化

ビットコードからKotlinで生成されたフレームワークをリビルドすると、元の`.dSYM`が無効になります。
ローカルで実行される場合、クラッシュレポートをシンボリケーションする際に更新された`.dSYM`が使用されていることを確認してください。

リビルドがApp Store側で実行される場合、リビルドされた*動的*フレームワークの`.dSYM`は破棄され、App Store Connectからダウンロードできないようです。
この場合、フレームワークを静的にすることが要求される場合があります。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.withType<org.jetbrains.kotlin.gradle.plugin.mpp.Framework> {
            isStatic = true
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.withType(org.jetbrains.kotlin.gradle.plugin.mpp.Framework) {
            isStatic = true
        }
    }
}
```

</tab>
</tabs>