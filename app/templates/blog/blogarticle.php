<?php snippet('header') ?>
<?php snippet('menu') ?>

<section class="content blogarticle">
  <article>
    <h1><?php echo html($page->title()) ?></h1>
    <?php echo kirbytext($page->text()) ?>

    <a href="<?php echo url('blog') ?>">Back…</a>

  </article>
</section>

<?php snippet('footer') ?>