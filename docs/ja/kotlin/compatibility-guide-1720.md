[//]: # (title: Kotlin 1.7.20 互換性ガイド)

_[言語をモダンに保つ](kotlin-evolution-principles.md)_ および _[快適なアップデート](kotlin-evolution-principles.md)_ は、Kotlin 言語設計の根本的な原則です。前者は言語の進化を妨げる構成要素は削除されるべきであることを示し、後者はコードの移行を可能な限りスムーズにするために、この削除を事前に十分に周知すべきであることを示しています。

通常、互換性のない変更はフィーチャーリリース（マイナーバージョンアップ）でのみ発生しますが、今回は Kotlin 1.7 で導入された変更によって生じた問題の広がりを抑えるため、インクリメンタルリリースで 2 つのそのような変更を導入する必要がありました。

このドキュメントでは、Kotlin 1.7.0 および 1.7.10 から Kotlin 1.7.20 への移行に関するリファレンスとして、それらをまとめています。

## 基本用語

このドキュメントでは、いくつかの種類の互換性について紹介します。

- _ソース (source)_: ソース互換性のない変更は、これまで正常にコンパイルできていた（エラーや警告がなかった）コードがコンパイルできなくなることを指します。
- _バイナリ (binary)_: 2 つのバイナリアーティファクトを入れ替えてもロードエラーやリンケージエラーが発生しない場合、それらはバイナリ互換であると言います。
- _振る舞い (behavioral)_: 変更の適用前後で、同じプログラムが異なる挙動を示す場合、その変更は振る舞いの互換性がないと言います。

これらの定義は、純粋な Kotlin に対してのみ与えられていることに注意してください。他の言語の観点（例：Java）からの Kotlin コードの互換性は、このドキュメントの範囲外です。

## 言語

<!--
### Title

> **Issue**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**:
>
> **Deprecation cycle**:
>
> - 1.5.20: warning
> - 1.7.0: report an error
-->

### 適切な制約処理を修正する試みのロールバック

> **Issue**: [KT-53813](https://youtrack.jetbrains.com/issue/KT-53813)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668) で説明されている変更の実装後、1.7.0 で発生した型推論の制約処理の問題を修正しようとする試みをロールバックしました。この試みは 1.7.10 で行われましたが、結果として新たな問題を引き起こしました。
>
> **Deprecation cycle**:
>
> - 1.7.20: 1.7.0 の動作にロールバック

### 問題のある複数のラムダおよび解決との相互作用を避けるため、一部のビルダー推論ケースを禁止

> **Issue**: [KT-53797](https://youtrack.jetbrains.com/issue/KT-53797)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 では「無制限のビルダー推論 (unrestricted builder inference)」と呼ばれる機能が導入され、`@BuilderInference` アノテーションが付与されていないパラメータに渡されたラムダでも、ビルダー推論の恩恵を受けられるようになりました。しかし、関数呼び出しにおいてそのようなラムダが複数存在する場合、いくつかの問題が発生する可能性がありました。
> 
> Kotlin 1.7.20 では、対応するパラメータに `@BuilderInference` がアノテーションされていない複数のラムダ関数において、ラムダ内の型推論を完了するためにビルダー推論を使用する必要がある場合、エラーを報告します。
>
> **Deprecation cycle**:
>
> - 1.7.20: そのようなラムダ関数に対してエラーを報告します。
> `-XXLanguage:+NoBuilderInferenceWithoutAnnotationRestriction` を使用することで、一時的に 1.7.20 より前の動作に戻すことができます。