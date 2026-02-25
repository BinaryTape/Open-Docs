[//]: # (title: LLVM バックエンドのカスタマイズに関するヒント)
<primary-label ref="advanced"/>

Kotlin/Native コンパイラは、さまざまなターゲットプラットフォーム向けにバイナリ実行ファイルを最適化し、生成するために [LLVM](https://llvm.org/) を使用しています。
コンパイル時間のかなりの部分は LLVM で費やされており、大規模なアプリケーションの場合、これが許容できないほど長い時間になることがあります。

Kotlin/Native がどのように LLVM を使用するかをカスタマイズし、最適化パス（optimization passes）のリストを調整することができます。

## ビルドログの調査

LLVM の最適化パスにどれくらいのコンパイル時間が費やされているかを理解するために、ビルドログを見てみましょう。

1. Gradle に LLVM プロファイリングの詳細を出力させるために、`-Pkotlin.internal.compiler.arguments.log.level=warning` オプションを付けて `linkRelease*` Gradle タスクを実行します。例えば以下の通りです。

   ```bash
   ./gradlew linkReleaseExecutableMacosArm64 -Pkotlin.internal.compiler.arguments.log.level=warning
   ```

   実行中、タスクは必要なコンパイラ引数を出力します。例えば以下のようになります。

   ```none
   > Task :linkReleaseExecutableMacosArm64
   Run in-process tool "konanc"
   Entry point method = org.jetbrains.kotlin.cli.utilities.MainKt.daemonMain
   Classpath = [
           /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/konan/lib/kotlin-native-compiler-embeddable.jar
           /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/konan/lib/trove4j.jar
   ]
   Arguments = [
           -Xinclude=...
           -library
           /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/klib/common/stdlib
           -no-endorsed-libs
           -nostdlib
           ...
   ]
   ```

2. 提供された引数に `-Xprofile-phases` 引数を加えて、コマンドラインコンパイラを実行します。例えば以下の通りです。

   ```bash
   /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/bin/kotlinc-native \
   -Xinclude=... \
   -library /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/klib/common/stdlib \
   ... \
   -Xprofile-phases
   ```

3. 生成されたビルドログの出力を調査します。ログは数万行に及ぶことがありますが、LLVM プロファイリングのセクションは最後にあります。

以下は、シンプルな Kotlin/Native プログラムを実行した際の抜粋です。

```none
Frontend: 275 msec
PsiToIr: 1186 msec
...
... 30k lines
...
LinkBitcodeDependencies: 476 msec
StackProtectorPhase: 0 msec
MandatoryBitcodeLLVMPostprocessingPhase: 2 msec
===-------------------------------------------------------------------------===
                          Pass execution timing report
===-------------------------------------------------------------------------===
  Total Execution Time: 6.7726 seconds (6.7192 wall clock)

   ---User Time---   --System Time--   --User+System--   ---Wall Time---  --- Name ---
   0.9778 ( 22.4%)   0.5043 ( 21.0%)   1.4821 ( 21.9%)   1.4628 ( 21.8%)  InstCombinePass
   0.3827 (  8.8%)   0.2497 ( 10.4%)   0.6323 (  9.3%)   0.6283 (  9.4%)  InlinerPass
   0.2815 (  6.4%)   0.1792 (  7.5%)   0.4608 (  6.8%)   0.4555 (  6.8%)  SimplifyCFGPass
...
   0.6444 (100.0%)   0.5474 (100.0%)   1.1917 (100.0%)   1.1870 (100.0%)  Total

ModuleBitcodeOptimization: 8118 msec
...
LTOBitcodeOptimization: 1399 msec
...
```

Kotlin/Native コンパイラは、モジュールパス（module passes）とリンクタイムパス（link-time passes）という、2つの独立した LLVM 最適化シーケンスを実行します。通常のコンパイルでは、これら 2 つのパイプラインは連続して実行され、主な違いはどの LLVM 最適化パスが実行されるかという点だけです。

上記のログでは、2 つの LLVM 最適化は `ModuleBitcodeOptimization` と `LTOBitcodeOptimization` です。整形された表は、各パスのタイミングを含む最適化の出力です。

## LLVM 最適化パスのカスタマイズ

上記のパスのいずれかが不当に長く思われる場合は、それをスキップすることができます。ただし、これにより実行時のパフォーマンスが低下する可能性があるため、その後でベンチマークのパフォーマンスに変化がないかを確認する必要があります。

現在、[特定のパスを無効化する](https://youtrack.jetbrains.com/issue/KT-69212)直接的な方法はありません。しかし、以下のコンパイラオプションを使用して、実行するパスの新しいリストを指定することができます。

| **オプション** | **リリースバイナリのデフォルト値** |
|------------------------|--------------------------------------|
| `-Xllvm-module-passes` | `"default<O3>"`                      |
| `-Xllvm-lto-passes`    | `"internalize,globaldce,lto<O3>"`    |

デフォルト値は実際のパスの長いリストに展開されるため、そこから不要なものを除外する必要があります。

実際のパスのリストを取得するには、LLVM ディストリビューションとともに `~/.konan/dependencies/llvm-{VERSION}-{ARCH}-{OS}-dev-{BUILD}/bin` ディレクトリに自動的にダウンロードされる [`opt`](https://llvm.org/docs/CommandGuide/opt.html) ツールを実行します。

例えば、リンクタイムパスのリストを取得するには、以下を実行します。

```bash
opt -print-pipeline-passes -passes="internalize,globaldce,lto<O3>" < /dev/null
```

これにより、LLVM のバージョンに応じた警告とパスの長いリストが出力されます。

`opt` ツールからのパスのリストと、Kotlin/Native コンパイラが実際に実行するパスには 2 つの違いがあります。

* `opt` はデバッグツールであるため、通常は実行されない 1 つ以上の `verify` パスが含まれています。
* Kotlin コンパイラがすでに自身で行っているため、Kotlin/Native は `devirt` パスを無効にしています。

パスを無効にした後は、実行時のパフォーマンス低下が許容範囲内かどうかを確認するために、必ずパフォーマンス・テストを再実行してください。