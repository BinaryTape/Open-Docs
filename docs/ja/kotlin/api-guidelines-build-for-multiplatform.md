[//]: # (title: マルチプラットフォーム向けKotlinライブラリの構築)

Kotlinライブラリを作成する際は、[Kotlin Multiplatformに対応してビルドおよび公開する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)ことを検討してください。
これにより、ライブラリの対象ユーザー層が広がり、複数のプラットフォームをターゲットとするプロジェクトと互換性を持つようになります。

以下のセクションでは、Kotlin Multiplatformライブラリを効果的に構築するためのガイドラインを提供します。

## リーチを最大化する

あなたのライブラリを依存関係として可能な限り多くのプロジェクトで利用できるようにするには、
Kotlin Multiplatformの[ターゲットプラットフォーム](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)をできるだけ多くサポートすることを目指してください。

あなたのライブラリがマルチプラットフォームプロジェクト（ライブラリかアプリケーションかを問わず）が使用するプラットフォームをサポートしていない場合、
そのプロジェクトがあなたのライブラリに依存することは難しくなります。
そのような場合、プロジェクトは一部のプラットフォームであなたのライブラリを使用し、他のプラットフォームでは別途ソリューションを実装する必要があるか、
またはすべてのプラットフォームをサポートする代替ライブラリを完全に選択することになります。

アーティファクトの生成を効率化するために、実験的な[クロスコンパイル](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html#host-requirements)を試して、任意のホストからKotlin Multiplatformライブラリを公開できます。
これにより、AppleマシンがなくてもAppleターゲット向けの`.klib`アーティファクトを生成できます。
この機能は今後安定化させ、ライブラリの公開をさらに改善する予定です。
この機能に関するフィードバックは、イシュートラッカーの[YouTrack](https://youtrack.jetbrains.com/issue/KT-71290)にお寄せください。

> Kotlin/Nativeターゲットの場合、可能なすべてのターゲットをサポートするために[段階的なアプローチ](native-target-support.md#for-library-authors)の使用を検討してください。
>
{style="note"}

## 共通コードから使用できるようにAPIを設計する

ライブラリを作成する際は、プラットフォーム固有の実装を記述するのではなく、共通Kotlinコードから利用できるようにAPIを設計してください。

可能な場合は適切なデフォルト設定を提供し、プラットフォーム固有の設定オプションも含めてください。
適切なデフォルト設定により、ユーザーはライブラリの設定のためにプラットフォーム固有の実装を記述することなく、共通KotlinコードからライブラリのAPIを使用できます。

最も広範囲に関連するソースセットにAPIを以下の優先順位で配置してください。

*   **`commonMain` ソースセット:** `commonMain` ソースセット内のAPIは、ライブラリがサポートするすべてのプラットフォームで利用できます。ライブラリのAPIのほとんどをここに配置することを目指してください。
*   **中間ソースセット:** 一部のプラットフォームが特定のAPIをサポートしていない場合、特定のプラットフォームをターゲットにするために[中間ソースセット](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html#intermediate-source-sets)を使用します。
    たとえば、マルチスレッドをサポートするターゲット向けの`concurrent`ソースセットや、すべての非JVMターゲット向けの`nonJvm`ソースセットを作成できます。
*   **プラットフォーム固有のソースセット:** プラットフォーム固有のAPIには、`androidMain`などのソースセットを使用します。

> Kotlin Multiplatformプロジェクトのソースセットの詳細については、「[階層型プロジェクト構造](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html)」を参照してください。
>
{style="tip"}

## プラットフォーム間での一貫した動作を保証する

サポートされるすべてのプラットフォームでライブラリが一貫して動作するようにするためには、
マルチプラットフォームライブラリ内のAPIは、すべてのプラットフォームで同じ範囲の有効な入力を受け入れ、同じアクションを実行し、
同じ結果を返す必要があります。
同様に、ライブラリは無効な入力を統一的に扱い、すべてのプラットフォームで一貫してエラーを報告するか、例外をスローする必要があります。

動作に一貫性がないと、ライブラリの使用が難しくなり、ユーザーはプラットフォーム固有の違いを管理するために共通コードに条件ロジックを追加せざるを得なくなります。

[`expect` および `actual` 宣言](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)を使用すると、共通コードで関数を宣言し、
各プラットフォームのネイティブAPIに完全にアクセスできるプラットフォーム固有の実装を持つことができます。
これらの実装も、共通コードから信頼性高く使用できるように、同じ動作をする必要があります。

APIがプラットフォーム間で一貫して動作する場合、`commonMain` ソースセットで一度だけ文書化すれば済みます。

> プラットフォームの違いが避けられない場合（例：あるプラットフォームがより広範な入力をサポートしている場合）でも、可能な限りそれらを最小限に抑えてください。たとえば、あるプラットフォームの機能を他のプラットフォームに合わせるために制限したくない場合などです。そのような場合は、具体的な違いを明確に文書化してください。
>
> {style=”note”}

## すべてのプラットフォームでテストする

マルチプラットフォームライブラリには、共通コードで記述され、すべてのプラットフォームで実行される[マルチプラットフォームテスト](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html)を含めることができます。
サポートされるプラットフォームでこの共通テストスイートを定期的に実行することで、ライブラリが正しく一貫して動作することを確認できます。

すべての公開プラットフォームでKotlin/Nativeターゲットを定期的にテストするのは難しい場合があります。
ただし、より広範な互換性を確保するためには、互換性をテストする際に[段階的な方法](native-target-support.md#for-library-authors)を使用して、サポート可能なすべてのターゲットに対してライブラリを公開することを検討してください。

[`kotlin-test`](https://kotlinlang.org/api/latest/kotlin.test/)ライブラリを使用して共通コードでテストを記述し、プラットフォーム固有のテストランナーで実行します。

## Kotlin以外のユーザーを考慮する

Kotlin Multiplatformは、サポートするターゲットプラットフォーム間でネイティブAPIと言語との相互運用性を提供します。
Kotlin Multiplatformライブラリを作成する際は、ユーザーがあなたのライブラリの型や宣言をKotlin以外の言語から使用する必要があるかどうかを考慮してください。

たとえば、ライブラリの特定の型が相互運用性を介してSwiftコードに公開される場合、
それらの型がSwiftから簡単にアクセスできるように設計してください。
[Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)は、Kotlin APIがSwiftから呼び出されたときにどのように見えるかについて役立つ洞察を提供します。

## ライブラリをプロモーションする

あなたのライブラリは、[JetBrainsの検索プラットフォーム](https://klibs.io/)に掲載される可能性があります。
これは、ターゲットプラットフォームに基づいてKotlin Multiplatformライブラリを簡単に検索できるように設計されています。

基準を満たすライブラリは自動的に追加されます。ライブラリを追加する方法の詳細については、[FAQ](https://klibs.io/faq)を参照してください。