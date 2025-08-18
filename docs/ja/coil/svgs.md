# SVG

SVGサポートを追加するには、拡張ライブラリをインポートします。

```kotlin
implementation("io.coil-kt.coil3:coil-svg:3.3.0")
```

これだけです！ `ImageLoader`は、どんなSVGでも自動的に検出してデコードします。Coilは、ファイルの先頭1KBにある`<svg `マーカーを探すことでSVGを検出します。これはほとんどのケースをカバーするはずです。SVGが自動的に検出されない場合は、リクエストに対して`Decoder`を明示的に設定できます。

```kotlin
imageView.load("/path/to/svg") {
    decoderFactory { result, options, _ -> SvgDecoder(result.source, options) }
}
```

必要に応じて、`ImageLoader`を構築する際にデコーダーをコンポーネントレジストリに手動で追加できます。

```kotlin
val imageLoader = ImageLoader.Builder(context)
    .components {
        add(SvgDecoder.Factory())
    }
    .build()