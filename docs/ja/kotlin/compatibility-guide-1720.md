---
title: "Kotlin 1.7.20 互換性ガイド"
---
_[Keeping the Language Modern](kotlin-evolution-principles)_ と _[Comfortable Updates](kotlin-evolution-principles)_ は、Kotlin言語設計における基本的な原則です。前者は、言語の進化を妨げる構造は削除されるべきであるとし、後者は、コードの移行を可能な限りスムーズにするために、この削除について事前に十分に周知されるべきであるとしています。

通常、非互換な変更はフィーチャーリリースでのみ発生しますが、今回はKotlin 1.7の変更によって発生した問題の広がりを制限するために、インクリメンタルリリースでそのような変更を2つ導入する必要があります。

このドキュメントでは、それらを要約し、Kotlin 1.7.0および1.7.10からKotlin 1.7.20への移行に関するリファレンスを提供します。

## Basic terms

このドキュメントでは、いくつかの種類の互換性について説明します。

- _source_: source-incompatible change（ソース互換性のない変更）とは、これまで（エラーや警告なしに）正常にコンパイルされていたコードがコンパイルできなくなる変更です。
- _binary_: 2つのバイナリアーティファクトがbinary-compatible（バイナリ互換）であるとは、それらを入れ替えても、ロードエラーやリンケージエラーが発生しないことを意味します。
- _behavioral_: behavioral-incompatible（動作互換性のない）変更とは、変更を適用する前と後で、同じプログラムが異なる動作を示す場合を指します。

これらの定義は、純粋なKotlinに対してのみ与えられていることに注意してください。Kotlinコードの他の言語からの互換性（たとえば、Javaから）は、このドキュメントの範囲外です。

## Language

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

### Rollback attempt to fix proper constraints processing

> **Issue**: [KT-53813](https://youtrack.jetbrains.com/issue/KT-53813)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668) で説明されている変更を実装した後、1.7.0で発生した型推論の制約処理の問題を修正する試みをロールバックします。この試みは1.7.10で行われましたが、今度は新しい問題を引き起こしました。
>
> **Deprecation cycle**:
>
> - 1.7.20: Rollback to 1.7.0 behavior

### Forbid some builder inference cases to avoid problematic interaction with multiple lambdas and resolution

> **Issue**: [KT-53797](https://youtrack.jetbrains.com/issue/KT-53797)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7では、unrestricted builder inference（制限のないビルダー推論）と呼ばれる機能が導入され、`@BuilderInference`で注釈されていないパラメーターに渡されたラムダでさえ、ビルダー推論の恩恵を受けることができました。ただし、そのようなラムダが関数呼び出しで複数回発生する場合、いくつかの問題が発生する可能性があります。
> 
> Kotlin 1.7.20では、対応するパラメーターが`@BuilderInference`で注釈されていない複数のラムダ関数が、ラムダ内の型の推論を完了するためにビルダー推論を使用する必要がある場合、エラーを報告します。
>
> **Deprecation cycle**:
>
> - 1.7.20: report an error on such lambda functions,  
> `-XXLanguage:+NoBuilderInferenceWithoutAnnotationRestriction` can be used to temporarily revert to the pre-1.7.20 behavior