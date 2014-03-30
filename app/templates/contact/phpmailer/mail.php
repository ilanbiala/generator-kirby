<?php

require_once("class.phpmailer.php");

$mail = new PHPMailer();

// $mail->IsSMTP();					// set mailer to use SMTP
// $mail->Host = ""; 				// specify main and backup server
// $mail->SMTPAuth = true;     		// turn on SMTP authentication
// $mail->Username = "";  			// SMTP username
// $mail->Password = ""; 			// SMTP password

if ($_POST) {

	$name = htmlspecialchars($_POST["user-name"]);

	$email = htmlspecialchars($_POST["user-email"]);

	$message = htmlspecialchars($_POST["comment"]);
	
	$userBcc = $_POST["user-bcc"];

	$siteAdminEmail = "<%= adminEmail %>";

	$siteAdminName = "<%= adminName %>";

	$mail->setFrom($email, $name);
	
	$mail->AddAddress($siteAdminEmail, $siteAdminName);
	
	$mail->AddReplyTo($email, $name);

	if ($userBcc == true) {
		$mail->addBCC($email);
	}

	$mail->Subject = "Contact form";
	$mail->Body    = $message;
	$mail->WordWrap = 80;

	if(!$mail->Send()) {
		echo "Message could not be sent.";
		echo "Mailer Error: " . $mail->ErrorInfo;
		exit;
	}

	echo "Message has been sent";

}

?>