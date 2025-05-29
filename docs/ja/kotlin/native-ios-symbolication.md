[//]: # (title: iOSクラッシュレポートのシンボル化)

iOSアプリケーションのクラッシュをデバッグする際には、クラッシュレポートの解析が必要となる場合があります。
クラッシュレポートの詳細については、[Appleドキュメント](https://developer.apple.com/library/archive/technotes/tn2151/_index.html)を参照してください。

クラッシュレポートは、適切に読み取れるようにするには、通常シンボル化が必要です。
シンボル化は、機械語のアドレスを人間が読み取れるソースの場所へと変換します。
以下のドキュメントでは、Kotlinを使用するiOSアプリケーションのクラッシュレポートをシンボル化する際のいくつかの具体的な詳細について説明します。

## リリース版Kotlinバイナリ用の.dSYMの生成

Kotlinコード内のアドレスをシンボル化するため(例: Kotlinコードに対応するスタックトレース要素のため)には、Kotlinコード用の`.dSYM`バンドルが必要です。

デフォルトでは、Kotlin/Nativeコンパイラは、Darwinプラットフォーム上のリリース版(すなわち、最適化された)バイナリに対して`.dSYM`を生成します。これは、`-Xadd-light-debug=disable`コンパイラフラグを使用して無効にできます。同時に、このオプションは他のプラットフォームではデフォルトで無効になっています。これを有効にするには、`-Xadd-light-debug=enable`コンパイラオプションを使用します。

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

IntelliJ IDEAまたはAppCodeテンプレートから作成されたプロジェクトでは、これらの`.dSYM`バンドルはXcodeによって自動的に検出されます。

## ビットコードからの再ビルドを使用する場合にフレームワークを静的にする

ビットコードからKotlin製のフレームワークを再ビルドすると、元の`.dSYM`が無効になります。
ローカルで実行される場合は、クラッシュレポートをシンボル化する際に、更新された`.dSYM`が使用されることを確認してください。

再ビルドがApp Store側で行われる場合、再ビルドされた*ダイナミック*フレームワークの`.dSYM`は破棄され、App Store Connectからダウンロードできないようです。
この場合、フレームワークを静的にする必要があるかもしれません。

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